const { DownloaderHelper } = require('node-downloader-helper');
const { uploadFileAndGetWebLink } = require('./GoogleDrive');
const crypto = require('crypto')
var request = require('request');

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
      let recording = ""
      let recordings = req.body.payload.object.recording_files[0]
      for(let i = 0; i < recordings.length; i++){
        if(recordings[i].file_extension === 'MP4' || recordings[i].file_extension === 'mp4'){
          recording = recordings[i]
        }
      }

    const downloadUrl = recording.download_url

    let f = (String(req.body.payload.object.topic) + " " + (new Date(req.body.payload.object.start_time)).toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })).replaceAll("/", "-")
    
    const dl = new DownloaderHelper(downloadUrl, __dirname, {fileName: f});

    dl.on('end', () => {
      console.log("File downloaded");
      console.log(req.body.payload.object.host_email);
        uploadFileAndGetWebLink(f, req.body.payload.object.host_email, req.body.payload.object.start_time)
        
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