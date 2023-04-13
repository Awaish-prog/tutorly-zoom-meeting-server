const express = require('express');
const { getPreviousMeetings, getUpcomingMeetings, printMeetingDetails, printMeetings } = require('./Controllers/Meetings');
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser');
const { downloadRecording } = require('./Controllers/ZoomWebhook');




app.use(cors())
app.use(bodyParser.json());

app.get("/getPreviousMeetings/:email/:role", getPreviousMeetings)

app.get("/getUpcomingMeetings/:email/:role", getUpcomingMeetings)


app.post("/getEvent", downloadRecording )


app.listen("4005", () => {
  console.log("server running");
})