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


//app.post("/getEvent", downloadRecording )


var options = {
  method: 'GET',
  // A non-existing sample userId is used in the example below.
  url: 'https://api.zoom.us/v2/users/awaish@tutorly.com/meetings',
  headers: {
    authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOm51bGwsImlzcyI6Ilg3a2d4RVg0UmFlWmhtcG55Y1dCRmciLCJleHAiOjE5MjIzMzcwMDAsImlhdCI6MTY4MTI2ODg0NX0.uvLZOaxC8V98vq8I7lYwQdm65UraiFmp8Qb9HFVfq08', // Do not publish or share your token publicly.
  },
};


function makeR(){
  request(options, function (error, response, body) {
    if (error) throw new Error(error);
    const j = JSON.parse(body)
    console.log(j);

  });
}


makeR()


app.listen("4005", () => {
  console.log("server running");
})