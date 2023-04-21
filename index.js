const express = require('express');
const { getPreviousMeetings, getUpcomingMeetings, rescheduleMeeting, cancelMeeting, test, getAvailability } = require('./Controllers/Meetings');
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser');
const { downloadRecording } = require('./Controllers/ZoomWebhook');
const { getDashboardData, getRecordingFolderLink } = require('./Controllers/DashboardData');
const { login } = require('./Controllers/User');
const { searchFolder } = require('./Controllers/GoogleDrive');


app.use(cors())
app.use(express.json());
app.use(bodyParser.json());


app.get("/getPreviousMeetings/:email/:role/:number/:limit", getPreviousMeetings)

app.get("/getUpcomingMeetings/:email/:role/:number/:limit", getUpcomingMeetings)

app.post("/getEvent", downloadRecording )

app.get("/getAvailabilty", getAvailability)

app.put("/rescheduleMeeting", rescheduleMeeting)

app.put("/cancelMeeting", cancelMeeting)

app.get("/getDashboardData/:email", getDashboardData)

app.post("/login", login)

//searchFolder("1ixfyJKuCLwytxzHBkEVDE66byh37gZ6j")
//console.log(new Date().toISOString().slice(0, 10));

//getRecordingFolderLink()

app.listen("4005", () => {
  console.log("server running");
})