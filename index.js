const express = require('express');
const { getPreviousMeetings, getUpcomingMeetings, printMeetingDetails } = require('./Controllers/Meetings');
const app = express()
const cors = require('cors')
const request = require('request')
const bodyParser = require('body-parser');
const { DownloaderHelper } = require('node-downloader-helper');
const crypto = require('crypto')



app.use(cors())
app.use(bodyParser.json());

app.get("/getPreviousMeetings/:email/:role", getPreviousMeetings)

app.get("/getUpcomingMeetings/:email/:role", getUpcomingMeetings)

app.post("/getEvent", (req, res) => {
  
  // const recording = req.body.payload.object.recording_files[0]
  // const downloadUrl = recording.download_url
  // console.log(downloadUrl);
    
  //   const dl = new DownloaderHelper(downloadUrl, __dirname);

  //   dl.on('end', () => {
  //     //printMeetingDetails(recording.meeting_id)
  //     console.log("here");
  //   });
  //   dl.on('error', (err) => console.log('Download Failed', err));
  //   dl.start().catch(err => console.error(err));
  var response

  console.log(req.headers)
  console.log(req.body)

  // construct the message string
  const message = `v0:${req.headers['x-zm-request-timestamp']}:${JSON.stringify(req.body)}`

  const hashForVerify = crypto.createHmac('sha256', "f2E7AulvQuGM18R5mwfZDg").update(message).digest('hex')

  // hash the message string with your Webhook Secret Token and prepend the version semantic
  const signature = `v0=${hashForVerify}`

  // you validating the request came from Zoom https://marketplace.zoom.us/docs/api-reference/webhook-reference#notification-structure
  if (req.headers['x-zm-signature'] === signature) {

    // Zoom validating you control the webhook endpoint https://marketplace.zoom.us/docs/api-reference/webhook-reference#validate-webhook-endpoint
    if(req.body.event === 'endpoint.url_validation') {
      const hashForValidate = crypto.createHmac('sha256', "f2E7AulvQuGM18R5mwfZDg").update(req.body.payload.plainToken).digest('hex')

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

      // business logic here, example make API request to Zoom or 3rd party

    }
  } else {

    response = { message: 'Unauthorized request to Zoom Webhook sample.', status: 401 }

    console.log(response.message)

    res.status(response.status)
    res.json(response)
  }
})


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