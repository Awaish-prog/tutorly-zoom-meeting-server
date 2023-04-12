const express = require('express');
const { getPreviousMeetings, getUpcomingMeetings, printMeetingDetails } = require('./Controllers/Meetings');
const app = express()
const cors = require('cors')
const request = require('request')
const bodyParser = require('body-parser');
const stream = require('stream');
const { downloadRecording } = require('./Controllers/ZoomWebhook');




app.use(cors())
app.use(bodyParser.json());

app.get("/getPreviousMeetings/:email/:role", getPreviousMeetings)

app.get("/getUpcomingMeetings/:email/:role", getUpcomingMeetings)


app.post("/getEvent", downloadRecording )


// var options = {
//   method: 'GET',
//   // A non-existing sample userId is used in the example below.
//   url: 'https://api.zoom.us/v2/meetings/iql/ZxJpTmmJ+xk0SALs+g==/recordings',
//   headers: {
//     authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOm51bGwsImlzcyI6Ilg3a2d4RVg0UmFlWmhtcG55Y1dCRmciLCJleHAiOjE2ODA4ODIwNTMsImlhdCI6MTY4MDg3NjY1NH0.pN7eDyqTS4k5tijBnso-zm_sEwB3VPDn1zCt2hK7plY', // Do not publish or share your token publicly.
//   },
// };


// function makeR(){
//   request(options, function (error, response, body) {
//     if (error) throw new Error(error);
//     const j = JSON.parse(body)
    

//   });
// }


// //makeR()


app.listen("4005", () => {
  console.log("server running");
})