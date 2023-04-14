const express = require('express');
const { getPreviousMeetings, getUpcomingMeetings, rescheduleMeeting, cancelMeeting, test, getAvailability } = require('./Controllers/Meetings');
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser');
const { downloadRecording } = require('./Controllers/ZoomWebhook');


app.use(cors())
app.use(express.json());
app.use(bodyParser.json());


app.get("/getPreviousMeetings/:email/:role", getPreviousMeetings)

app.get("/getUpcomingMeetings/:email/:role", getUpcomingMeetings)


app.post("/getEvent", downloadRecording )

app.get("/getAvailabilty", getAvailability)

app.put("/rescheduleMeeting", rescheduleMeeting)

app.put("/cancelMeeting", cancelMeeting)

//test()

app.listen("4005", () => {
  console.log("server running");
})