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

// const KEYFILEPATH = __dirname + "/google-key.json"
// const SCOPES = ['https://www.googleapis.com/auth/drive']

// const auth = new google.auth.GoogleAuth({
//   keyFile: KEYFILEPATH,
//   scopes: SCOPES
// })


app.use(cors())
app.use(bodyParser.json());

app.get("/getPreviousMeetings/:email/:role", getPreviousMeetings)

app.get("/getUpcomingMeetings/:email/:role", getUpcomingMeetings)

// async function uploadFile(auth) {
//   const dr = google.drive({version: 'v3', auth})

//   let fm = {
//     "name": "GMT20230411-030257_Recording_640x360.mp4"
//   }

//   let m = {
//     mimeType: "video/mp4",
//     body: fs.createReadStream("GMT20230411-030257_Recording_640x360.mp4")
//   }

//   let res = await dr.files.create({
//     resource: fm,
//     media: m,
//   })

//   console.log(res);
// }





// function upload2(){
//   const auth = new google.auth.JWT(
//     "tutorlyrecording@tutorly-recordings.iam.gserviceaccount.com",
//     null,
//     "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCcI+rD2WFQtkpN\nLZHzaHyey0EWcZgUdkj52clQZsTziokcR9p25+rR/RIdf2+1Kx8lJKUsWkQdN3bB\nTvbbDi7YaqojPuvQYjmFB0g1jJM11zQBRH9z9iALWutx0CCmYUSqwipkjaxpX5hR\n0f4pkhc8/tWsZu6UY4EhLW163E3v+Quq7L+vv20SDOsSs/Eg8DWAeOXmSp1vhjAr\n5WhLkzhsPuYVEk1mm0yEliYJuAmnxfnAXPksqZuRMyHb0a5zcl1Gk0c+1tb7CRiY\n9rrA26K13QhXhOR4IkymIevd1uVBTDm8ccCtave8cuDNqvkdCnRkHYf21s154mMV\nozVna0f1AgMBAAECggEACXdJ+SP5eOBcTSUunIBLUdXbtSXKL69jdDZGX1KjrRTL\nLto8/d7IhyuIXh5xjMe3pH5TadwdFgex8j08d6z6nRHhDQWjBpKgjxaRGPdT82cq\nbCCVeNfFOzsAsXk0iYcLF9kb+IBNoWPIwxPFN2BNJVxZDZHTSU67r4xmqen86vKT\ncFOhzgY8pvgqQSBBwIIO2B3o70L/E37axAhTnNQS6XuneFYaEKt4ZaGmRTIaBeAo\nstodh1wGyAd5werrK33b/NXd8rgCgxHFA5wWfLhy06i6GpC51SxSV5fiI9MDpEzC\nDR6QDKx+ZAD/gcIY5P+FRKmQH/0e/QCG8mB2SS6+0QKBgQDbY663F9uj+mhjgzB8\n96fpjKgosSfrBST6wheRQ1LGAQUZ+RoYTOCtKI6SihHmvhwNIr5RpOhPvw38/qSw\nckJpYP0jSQCcl9Tvs+W8gWjLN46xSQjBXv704FgcWmQ20rp6jypIqCPropfp1Sqe\nkRiBTG05K9qX/nWaWKmN2xvsXQKBgQC2Mjub4BVa0GR1b7coYfO6aQMRblAW0q2x\nwNiXPr0Y2rizGXO6+SJ+YpaDwUKNki9vDtxS4PJ7Kgvbe4cxEq3Ey4hzqw4hMHz5\nOQPXvY6vJuD1zHwtBvrNoqiBbgDq7111eWuEvdHEBeC1kPO7Mxk5sA9x57eD0CQ/\nWnbV+RHQeQKBgFilmaYvxLcoal+zVbdZFob/J79xfdCv/nY4UO+IRXzuUpJhHhMt\nlSdCmQFLOtqCfLEuFbrFqHz4lP1iI0eMk5si7oYAbHfZvdexWCXoIGDkrQqjmR8R\ndHGb6N5kA9RHJ8R37rz2+7StuTZpxNPXixBLwmJ0ftolnn1kT/aaz1idAoGBAKce\nuJKoHq5oTF10FZsTDg9E162bdBcbNHvBmmpQ//7WUWjmxcMRVtR69fjwwm09VAkY\npnvXHlRfIvU1/7HBombLEuSWWKWU5m1sINw5YbHDhcGwyY47wr3wn4PpNSpKWX2x\n3C+sNccKZS3mQcrKei7yEZi3pRthRn5eKnbmubJxAoGAftKJGMIVl3jSNnx/99Lc\nDN9drj2iNhIi8YemfhDjGqsHYblYm54msBcGc4rYKZ7z3kGbILYhq7HROhBSkdFQ\nb5D5IV3PWv87qv1lBJjiyZ46YjnFcwrl9oWFiBbY79YCsj5QgJBa84tCfSmNsq5p\nsMF5m00mLPrvPyPvpH878+w=\n-----END PRIVATE KEY-----\n",
//     ['https://www.googleapis.com/auth/drive']
//   );
  
//   const drive = google.drive({ version: 'v3', auth });

//   const file = fs.createReadStream(path.join(__dirname, 'GMT20230411-030257_Recording_640x360.mp4'));

//   drive.files.create({
//     resource: {
//       name: 'GMT20230411-030257_Recording_640x360.mp4',
//       parent: ['1yg1mW9IBzjdhpa70bPwYv4MN7S732qFp']
//     },
//     media: {
//       mimeType: 'video/mp4',
//       body: file,
//     },
//   }, (err, res) => {
//     if (err) {
//       console.error(err);
//     } else {
//       console.log(`File uploaded: ${res.data.id}`);
//     }
//   });
  
// }




//uploadFile(auth)

const GOOGLE_DRIVE_CLIENT_ID= "590998069758-nmo7i410ubnqqnvijdabadcb8j8649ti.apps.googleusercontent.com"
const GOOGLE_DRIVE_CLIENT_SECRET= "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"
const GOOGLE_DRIVE_REDIRECT_URI= "https://developers.google.com/oauthplayground"
const GOOGLE_DRIVE_REFRESH_TOKEN= "1//04TLsK0g8ONkECgYIARAAGAQSNwF-L9Ir0I5LnmsAbyXxrv2JrxFR4fF77i51i1aoudZ6lO62ihBxpQd_q95wYAmPUICJT7qnzl4"


function saveFile(fileName, filePath, fileMimeType) {

  const client = new google.auth.OAuth2(GOOGLE_DRIVE_CLIENT_ID, GOOGLE_DRIVE_CLIENT_SECRET, GOOGLE_DRIVE_REDIRECT_URI);

    client.setCredentials({ refresh_token: GOOGLE_DRIVE_REFRESH_TOKEN });

    const driveClient = google.drive({
      version: 'v3',
      auth: client,
    });
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
  await saveFile("GMT20230411-030257_Recording_640x360.mp4", path.join(__dirname, "GMT20230411-030257_Recording_640x360.mp4"), "video/mp4")
}

upload()
app.post("/getEvent", (req, res) => {
  

  var response

  console.log(req.headers)
  console.log(req.body)

  // construct the message string
  const message = `v0:${req.headers['x-zm-request-timestamp']}:${JSON.stringify(req.body)}`

  const hashForVerify = crypto.createHmac('sha256', "D4HtDu_4T8OWhiYjBqoKhg").update(message).digest('hex')

  // hash the message string with your Webhook Secret Token and prepend the version semantic
  const signature = `v0=${hashForVerify}`

  // you validating the request came from Zoom https://marketplace.zoom.us/docs/api-reference/webhook-reference#notification-structure
  if (req.headers['x-zm-signature'] === signature) {

    // Zoom validating you control the webhook endpoint https://marketplace.zoom.us/docs/api-reference/webhook-reference#validate-webhook-endpoint
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

      // business logic here, example make API request to Zoom or 3rd party
      const recording = req.body.payload.object.recording_files[0]
  const downloadUrl = recording.download_url
  console.log(downloadUrl);
    
    const dl = new DownloaderHelper(downloadUrl, __dirname);

    dl.on('end', () => {
      //printMeetingDetails(recording.meeting_id)
      console.log("here");
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