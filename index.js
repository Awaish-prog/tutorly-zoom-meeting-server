const express = require('express');
const { getPreviousMeetings, getUpcomingMeetings, printMeetingDetails } = require('./Controllers/Meetings');
const app = express()
const cors = require('cors')
const request = require('request')
const bodyParser = require('body-parser');
const { DownloaderHelper } = require('node-downloader-helper');
const crypto = require('crypto')
const path = require('path');
const stream = require('stream');

const fs = require('fs')
const {google} = require('googleapis')




app.use(cors())
app.use(bodyParser.json());

app.get("/getPreviousMeetings/:email/:role", getPreviousMeetings)

app.get("/getUpcomingMeetings/:email/:role", getUpcomingMeetings)



const GOOGLE_DRIVE_CLIENT_ID= "590998069758-nmo7i410ubnqqnvijdabadcb8j8649ti.apps.googleusercontent.com"
const GOOGLE_DRIVE_CLIENT_SECRET= "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"
const GOOGLE_DRIVE_REDIRECT_URI= "https://developers.google.com/oauthplayground"
const GOOGLE_DRIVE_REFRESH_TOKEN= "1//04TLsK0g8ONkECgYIARAAGAQSNwF-L9Ir0I5LnmsAbyXxrv2JrxFR4fF77i51i1aoudZ6lO62ihBxpQd_q95wYAmPUICJT7qnzl4"

const client = new google.auth.OAuth2(GOOGLE_DRIVE_CLIENT_ID, GOOGLE_DRIVE_CLIENT_SECRET, GOOGLE_DRIVE_REDIRECT_URI);

    client.setCredentials({ refresh_token: GOOGLE_DRIVE_REFRESH_TOKEN });

    const driveClient = google.drive({
      version: 'v3',
      auth: client,
    });

function saveFile(fileName, filePath, fileMimeType) {

  
  return driveClient.files.create({
    requestBody: {
      name: fileName,
      mimeType: fileMimeType,
      parents: [],
    },
    media: {
      mimeType: fileMimeType,
      body: fs.createReadStream(filePath),
    },
  });
}

async function upload(){
  console.log(path.join(__dirname, "GMT20230411-030257_Recording_640x360.mp4"));
  const x = await saveFile("GMT20230411-030257_Recording_640x360.mp4", path.join(__dirname, "GMT20230411-030257_Recording_640x360.mp4"), "video/mp4")
  console.log(x.data.id);
}

async function getFile(){
  const x = await driveClient.files.get({
    fileId: '1T7MsrywtY4nPmr1HZYrVpNdosEHfj_EX',
    fields: 'webViewLink'
  })
  console.log(x);
}

//getFile()
//upload()
// app.post("/getEvent", (req, res) => {
  

//   var response

//   console.log(req.headers)
//   console.log(req.body)

//   // construct the message string
//   const message = `v0:${req.headers['x-zm-request-timestamp']}:${JSON.stringify(req.body)}`

//   const hashForVerify = crypto.createHmac('sha256', "D4HtDu_4T8OWhiYjBqoKhg").update(message).digest('hex')

//   // hash the message string with your Webhook Secret Token and prepend the version semantic
//   const signature = `v0=${hashForVerify}`

//   // you validating the request came from Zoom https://marketplace.zoom.us/docs/api-reference/webhook-reference#notification-structure
//   if (req.headers['x-zm-signature'] === signature) {

//     // Zoom validating you control the webhook endpoint https://marketplace.zoom.us/docs/api-reference/webhook-reference#validate-webhook-endpoint
//     if(req.body.event === 'endpoint.url_validation') {
//       const hashForValidate = crypto.createHmac('sha256', "D4HtDu_4T8OWhiYjBqoKhg").update(req.body.payload.plainToken).digest('hex')

//       response = {
//         message: {
//           plainToken: req.body.payload.plainToken,
//           encryptedToken: hashForValidate
//         },
//         status: 200
//       }

//       console.log(response.message)

//       res.status(response.status)
//       res.json(response.message)
//     } else {
//       response = { message: 'Authorized request to Zoom Webhook sample.', status: 200 }

//       console.log(response.message)

//       res.status(response.status)
//       res.json(response)

//       // business logic here, example make API request to Zoom or 3rd party
//       const recording = req.body.payload.object.recording_files[0]
//   const downloadUrl = recording.download_url
//   console.log(downloadUrl);
    
//     const dl = new DownloaderHelper(downloadUrl, __dirname);

//     dl.on('end', () => {
//       //printMeetingDetails(recording.meeting_id)
//       console.log("here");
//     });
//     dl.on('error', (err) => console.log('Download Failed', err));
//     dl.start().catch(err => console.error(err));

//     }
//   } else {

//     response = { message: 'Unauthorized request to Zoom Webhook sample.', status: 401 }

//     console.log(response.message)

//     res.status(response.status)
//     res.json(response)
//   }
// })


var options = {
  method: 'GET',
  // A non-existing sample userId is used in the example below.
  url: 'https://api.zoom.us/v2/meetings/iql/ZxJpTmmJ+xk0SALs+g==/recordings',
  headers: {
    authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOm51bGwsImlzcyI6Ilg3a2d4RVg0UmFlWmhtcG55Y1dCRmciLCJleHAiOjE2ODA4ODIwNTMsImlhdCI6MTY4MDg3NjY1NH0.pN7eDyqTS4k5tijBnso-zm_sEwB3VPDn1zCt2hK7plY', // Do not publish or share your token publicly.
  },
};


function makeR(){
  request(options, function (error, response, body) {
    if (error) throw new Error(error);
    const j = JSON.parse(body)
    

  });
}


//makeR()


app.listen("4005", () => {
  console.log("server running");
})