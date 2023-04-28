const express = require('express');
const { getPreviousMeetings, getUpcomingMeetings, rescheduleMeeting, cancelMeeting, getAvailability } = require('./Controllers/Meetings');
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser');
const { downloadRecording } = require('./Controllers/ZoomWebhook');
const { getDashboardData, getDashboardDataTest, getRecordingFolderLink } = require('./Controllers/DashboardData');
const { login } = require('./Controllers/User');
const { authentication } = require('./Middlewares/Authenticate');


app.use(cors())
app.use(express.json());
app.use(bodyParser.json());


app.get("/getPreviousMeetings/:email/:role/:number", authentication, getPreviousMeetings)

app.get("/getUpcomingMeetings/:email/:role/:number", authentication, getUpcomingMeetings)

app.post("/getEvent", downloadRecording )

app.get("/getAvailabilty", authentication, getAvailability)

app.put("/rescheduleMeeting", authentication, rescheduleMeeting)

app.put("/cancelMeeting", authentication, cancelMeeting)

app.get("/getDashboardData/:email", authentication, getDashboardData)

app.post("/login", login)

async function test(){
  console.log(await getRecordingFolderLink("ishaadhing8407@student.lvusd.org"));
}

//test()


app.listen("4005", () => {
  console.log("server running");
})