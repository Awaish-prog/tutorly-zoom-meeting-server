const { DownloaderHelper } = require('node-downloader-helper');
const { uploadFileAndGetWebLink } = require('./GoogleDrive');
const crypto = require('crypto')

function downloadRecording(req, res){
    var response

  const message = `v0:${req.headers['x-zm-request-timestamp']}:${JSON.stringify(req.body)}`

  const hashForVerify = crypto.createHmac('sha256', "D4HtDu_4T8OWhiYjBqoKhg").update(message).digest('hex')

  
  const signature = `v0=${hashForVerify}`

  if (req.headers['x-zm-signature'] === signature) {

  
    if(req.body.event === 'endpoint.url_validation') {
      const hashForValidate = crypto.createHmac('sha256', "D4HtDu_4T8OWhiYjBqoKhg").update(req.body.payload.plainToken).digest('hex')

      response = {
        message: {
          plainToken: req.body.payload.plainToken,
          encryptedToken: hashForValidate
        },
        status: 200
      }

      console.log(response.message)

      res.status(response.status)
      res.json(response.message)
    } else {
      response = { message: 'Authorized request to Zoom Webhook sample.', status: 200 }

      console.log(response.message)

      res.status(response.status)
      res.json(response)

      const recording = req.body.payload.object.recording_files[0]
  const downloadUrl = recording.download_url

    
    const dl = new DownloaderHelper(downloadUrl, __dirname, { fileName: "testFile" });

    dl.on('end', () => {
      uploadFileAndGetWebLink("testFile.mp4")
      console.log("File downloaded");
    });
    dl.on('error', (err) => console.log('Download Failed', err));
    dl.start().catch(err => console.error(err));

    }
  } else {

    response = { message: 'Unauthorized request to Zoom Webhook sample.', status: 401 }

    console.log(response.message)

    res.status(response.status)
    res.json(response)
  }
}

module.exports = { downloadRecording }