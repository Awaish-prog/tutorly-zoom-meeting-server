const express = require('express');
const { getPreviousMeetings, getUpcomingMeetings, rescheduleMeeting, cancelMeeting } = require('./Controllers/Meetings');
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser');
const { downloadRecording } = require('./Controllers/ZoomWebhook');


app.use(cors())
app.use(bodyParser.json());

app.get("/getPreviousMeetings/:email/:role", getPreviousMeetings)

app.get("/getUpcomingMeetings/:email/:role", getUpcomingMeetings)


app.post("/getEvent", downloadRecording )

app.post("/rescheduleMeeting", rescheduleMeeting)

app.post("/cancelMeeting", cancelMeeting)


app.listen("4005", () => {
  console.log("server running");
})