const express = require('express');
const { getPreviousMeetings, getUpcomingMeetings, rescheduleMeeting, cancelMeeting, getAvailability, printCalenderId } = require('./Controllers/Meetings');
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser');
const { downloadRecording } = require('./Controllers/ZoomWebhook.js');
const { getDashboardData, googleSheetTest, updateStudentIds, googleSheetDataTutor, getMapleStudent, mapleSheetUpdate, getDashboardDataTest, createNewSheet } = require('./Controllers/DashboardData.js');
const { login, getPayroll, markStatus } = require('./Controllers/User.js');
const { authentication } = require('./Middlewares/Authenticate.js');
const path = require('path');
const { createNotionPageWithEmail, createNotionPages, updateNotionPages } = require('./Controllers/Notion.js');
const { searchFolder } = require('./Controllers/GoogleDrive.js');
const { createWhiteboardData, getBoardsList } = require('./Controllers/WhiteBoardAppScripts.js');
const { updateWhiteboard, getWhiteboardData, deleteWhiteboardData, checkLink } = require('./Controllers/WhiteBoardAppScripts.js');

const v8 = require('v8');
const { createPaper, deleteBitpaper } = require('./Controllers/Bitpapaer');
const { populateConversationStore, handleSlackMessage, getChannels, initializeSlackIds, getChat, getReplies, postMessage, getBotUserName, getUserName } = require('./Controllers/Slack');




app.use(cors())
app.use(express.json());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'build')))
app.use(express.static(path.join(__dirname, 'tutorly-sheet-update-build')))
app.use(express.static(path.join(__dirname, 'white-board')))


app.post("/slackMessage", (req, res) => {
  req.body.event.userName = getUserName(req.body.event.user)
  outer_socket.emit("sendMessage", req.body.event)
})

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

app.get("/getChat/:channel", authentication, getChat)

app.get("/getReplies/:channel/:ts", authentication, getReplies)

app.post("/getPayroll", authentication, getPayroll)

app.get("/updateTutorSheets", (req, res) => {
  res.sendFile(path.join(__dirname, "tutorly-sheet-update-build/index.html"))
})

app.get("/joinWhiteboard*", (req, res) => {
  res.sendFile(path.join(__dirname, "white-board/index.html"))
})

app.get("/updateMapleSheets", (req, res) => {
  mapleSheetUpdate()
  res.send("Please check Maple sessions sheet, it will update in few seconds..")
})


let outer_socket = null

app.get("/test", (req, res) => {
  outer_socket.emit("request")
  res.send("request")
})


app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build/index.html"))
})


const io = require("socket.io")(8080, {
  cors: {
      origin: "*"
  }
});



io.on("connection", (socket) => {
  outer_socket = socket
  console.log("connected");

  socket.on("postMessage", (channel, userName, text, showThread, ts) => {
     postMessage(channel, userName, text, showThread, ts)
  })
})




app.listen("4005", async () => {
  
  //createNotionPageWithEmail("gracebernal@mapleschool.org")
  //updateStudentIds()
  //printCalenderId("awaish@tutorly.com")
  //googleSheetDataTutor(null, null)
  //createNotionPages()
  //updateNotionPages()
  //mapleSheetUpdate()

  //createNewSheet()
  //markStatus()
  //initializeSlackIds()
  //populateConversationStore()

  console.log("server running");
})
