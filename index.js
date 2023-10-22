const express = require('express');
const { getPreviousMeetings, getUpcomingMeetings, rescheduleMeeting, cancelMeeting, getAvailability } = require('./Controllers/Meetings');
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser');
const { downloadRecording } = require('./Controllers/ZoomWebhook.js');
const { getDashboardData, googleSheetTest, updateStudentIds, googleSheetDataTutor, mapleSheetUpdate } = require('./Controllers/DashboardData.js');
const { login, getPayroll, markStatus } = require('./Controllers/User.js');
const { authentication } = require('./Middlewares/Authenticate.js');
const path = require('path');
const { searchFolder } = require('./Controllers/GoogleDrive.js');
const { createWhiteboardData, getBoardsList } = require('./Controllers/WhiteBoardAppScripts.js');
const { deleteWhiteboardData } = require('./Controllers/WhiteBoardAppScripts.js');

const v8 = require('v8');
const { createPaper, deleteBitpaper } = require('./Controllers/Bitpapaer');
const { getChannels, getChat, getReplies, getNotification, getSlackFileUrl } = require('./Controllers/Slack');
const { tweet } = require('./Controllers/Twitter');
const { postToInsta } = require('./Controllers/Instagaram');
const { postToSocials } = require('./Controllers/SocialPost');





app.use(cors())
app.use(express.json());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'build')))
app.use(express.static(path.join(__dirname, 'tutorly-sheet-update-build')))
app.use(express.static(path.join(__dirname, 'white-board')))


//

app.get("/getPreviousMeetings/:email/:role/:number", authentication, getPreviousMeetings)

app.get("/getUpcomingMeetings/:email/:role/:number", authentication, getUpcomingMeetings)

app.post("/getEvent", downloadRecording )

app.post("/createWhiteboardData", authentication, createWhiteboardData )

app.post("/createBitpaper", authentication, createPaper )

app.post("/deleteBitpaper", authentication, deleteBitpaper )

app.post("/getBoardsList", authentication, getBoardsList )

app.post("/deleteWhiteboard", authentication, deleteWhiteboardData )

app.get("/getAvailabilty", authentication, getAvailability)

app.put("/rescheduleMeeting", authentication, rescheduleMeeting)

app.put("/cancelMeeting", authentication, cancelMeeting)

app.put("/markStatus", authentication, markStatus)

app.get("/getDashboardData/:email/:role", authentication, getDashboardData)

app.post("/login", login)

app.get("/getSheetData", googleSheetTest)

app.get("/getSheetDataTutor/:tutor/:driveId/:from/:to", googleSheetDataTutor)

app.get("/getChannelsList/:email", authentication, getChannels)

app.get("/getChat/:channel/:private", authentication, getChat)

app.get("/getSlackFileUrl/:fileId", authentication, getSlackFileUrl)

app.get("/getReplies/:channel/:ts/:conversationId/:showChannels", authentication, getReplies)

app.post("/getPayroll", authentication, getPayroll)

app.get("/getNotification/:email", getNotification)

app.get("/updateTutorSheets", (req, res) => {
  res.sendFile(path.join(__dirname, "tutorly-sheet-update-build/index.html"))
})

app.post("/wordpress", (req, res) => {
  
  if(req.body && req.body.post && req.body.post.post_title && req.body.post_thumbnail && req.body.post_permalink){
    postToInsta(req.body.post.post_title, req.body.post_thumbnail, req.body.post_permalink)
    tweet(req.body.post.post_title, req.body.post_thumbnail, req.body.post_permalink)
    postToSocials(req.body.post.post_title, req.body.post_thumbnail, req.body.post_permalink)
  }
  res.json({status: 201})
})

app.post("/hubspotevent", (req, res) => {
  console.log(req.body);
  res.status(200).json({status: 200})
})

app.get("/joinWhiteboard*", (req, res) => {
  res.sendFile(path.join(__dirname, "white-board/index.html"))
})

app.get("/updateStudentIds", (req, res) => {
  updateStudentIds()
  res.send("Request Sent....")
})

app.get("/updateMapleSheets", (req, res) => {
  mapleSheetUpdate()
  res.send("Please check Maple sessions sheet, it will update in few seconds..")
})





app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build/index.html"))
})







app.listen("4005", async () => {
  
  
  //updateStudentIds()
  
  // updateLalaSheets("2023-08-21", "lala tutoring", "english", "1FVLzaWrh9KArTZGEe0MX01SwEKkuqf_EUdSytAHQzfM")
  // updateLalaSheets("2023-09-12", "maple", " ela ", "1UHge0WVFWozPd3DoVU-vOn4Qs8UjQUx8HF_eh2r6dB8")
  
  console.log("server running");
})
