const express = require('express');
const { getPreviousMeetings, getUpcomingMeetings } = require('./Controllers/Meetings');
const app = express()
const cors = require('cors')
const request = require('request')
const bodyParser = require('body-parser');
const { DownloaderHelper } = require('node-downloader-helper');



app.use(cors())
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/getPreviousMeetings/:email/:role", getPreviousMeetings)

app.get("/getUpcomingMeetings/:email/:role", getUpcomingMeetings)

app.post("/getEvent", (req, res) => {
  console.log(res.body);
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
    const downloadUrl = j.recording_files[0].download_url;
    
    const dl = new DownloaderHelper(downloadUrl, __dirname);

    dl.on('end', () => console.log('Download Completed'));
    dl.on('error', (err) => console.log('Download Failed', err));
    dl.start().catch(err => console.error(err));

  });
}


//makeR()


app.listen("4000", () => {
  console.log("server running");
})