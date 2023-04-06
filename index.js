const express = require('express');
const { getPreviousMeetings, getUpcomingMeetings } = require('./Controllers/Meetings');
const app = express()

app.get("/getPreviousMeetings/:email/:role", getPreviousMeetings)

app.get("/getUpcomingMeetings/:email/:role", getUpcomingMeetings)


app.listen("4000", () => {
  console.log("server running");
})