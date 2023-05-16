const express = require('express');
const { getPreviousMeetings, getUpcomingMeetings, rescheduleMeeting, cancelMeeting, getAvailability, printCalenderId } = require('./Controllers/Meetings');
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser');
const { downloadRecording } = require('./Controllers/ZoomWebhook');
const { getDashboardData, googleSheetTest, updateStudentIds, googleSheetDataTutor } = require('./Controllers/DashboardData');
const { login } = require('./Controllers/User');
const { authentication } = require('./Middlewares/Authenticate');
const path = require('path');
const { createNotionPageWithEmail } = require('./Controllers/Notion');





app.use(cors())
app.use(express.json());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'build')))
app.use(express.static(path.join(__dirname, 'tutorly-sheet-update-build')))


app.get("/getPreviousMeetings/:email/:role/:number", authentication, getPreviousMeetings)

app.get("/getUpcomingMeetings/:email/:role/:number", authentication, getUpcomingMeetings)

app.post("/getEvent", downloadRecording )

app.get("/getAvailabilty", authentication, getAvailability)

app.put("/rescheduleMeeting", authentication, rescheduleMeeting)

app.put("/cancelMeeting", authentication, cancelMeeting)

app.get("/getDashboardData/:email/:role", authentication, getDashboardData)

app.post("/login", login)

app.get("/getSheetData", googleSheetTest)

app.get("/getSheetDataTutor/:tutor/:driveId/:from/:to", googleSheetDataTutor)

app.get("/updateTutorSheets", (req, res) => {
  res.sendFile(path.join(__dirname, "tutorly-sheet-update-build/index.html"))
})



app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build/index.html"))
})


app.listen("4005", () => {
  //createNotionPageWithEmail("e.mondesir2001@yahoo.com")
  //updateStudentIds()
  //printCalenderId("awaish@tutorly.com")
  //googleSheetDataTutor(null, null)
  console.log("server running");
})