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

      const recording = req.body.payload.object.recording_files[0].file_extension === 'MP4' ? 
      req.body.payload.object.recording_files[0] :
      req.body.payload.object.recording_files[1]
    const downloadUrl = recording.download_url
        console.log(req.body.payload.object);
    
    const dl = new DownloaderHelper(downloadUrl, __dirname, {fileName: "ZoomR.mp4"});

    dl.on('end', () => {
        var options = {
            method: 'GET',
            // A non-existing sample userId is used in the example below.
            url: `https://api.zoom.us/v2/users/${req.body.payload.object.host_email}/meetings`,
            headers: {
              authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOm51bGwsImlzcyI6Ilg3a2d4RVg0UmFlWmhtcG55Y1dCRmciLCJleHAiOjE5MjIzMzcwMDAsImlhdCI6MTY4MTI3NzEwN30.5Nq4bNDiz4i7wEe_sty4zn7uF1jKYjhLgFWIYj10Llc', // Do not publish or share your token publicly.
            },
          };
          
          request(options, function (error, response, body) {
            if (error) throw new Error(error);
            console.log("**********************************************************************");
            console.log(body);
            uploadFileAndGetWebLink("ZoomR.mp4", req.body.payload.object.host_email, body.start_time)
            console.log("File downloaded");
          });
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