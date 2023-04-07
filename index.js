const express = require('express');
const { getPreviousMeetings, getUpcomingMeetings } = require('./Controllers/Meetings');
const app = express()
const cors = require('cors')
const request = require('request')

app.use(cors())

app.get("/getPreviousMeetings/:email/:role", getPreviousMeetings)

app.get("/getUpcomingMeetings/:email/:role", getUpcomingMeetings)

var options = {
  method: 'GET',
  // A non-existing sample userId is used in the example below.
  url: 'https://api.zoom.us/v2/users/antonia@tutorly.com/meetings',
  headers: {
    authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOm51bGwsImlzcyI6Ilg3a2d4RVg0UmFlWmhtcG55Y1dCRmciLCJleHAiOjE2ODA4NDI1MjksImlhdCI6MTY4MDgzNzEyOX0.oV_WenOWQIufvG8tDE1TzU_bpnTkyxdi_almf9m5ZPo', // Do not publish or share your token publicly.
  },
};

function makeR(){
  request(options, function (error, response, body) {
    if (error) throw new Error(error);
    const j = JSON.stringify(JSON.parse(body), null, 2);
    console.log(j);
  });
}


makeR()


app.listen("4000", () => {
  console.log("server running");
})