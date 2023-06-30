const express = require('express');
const { getPreviousMeetings, getUpcomingMeetings, rescheduleMeeting, cancelMeeting, getAvailability, printCalenderId } = require('./Controllers/Meetings');
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser');
const { downloadRecording } = require('./Controllers/ZoomWebhook');
const { getDashboardData, googleSheetTest, updateStudentIds, googleSheetDataTutor, getMapleStudent, mapleSheetUpdate } = require('./Controllers/DashboardData');
const { login } = require('./Controllers/User');
const { authentication } = require('./Middlewares/Authenticate');
const path = require('path');
const { createNotionPageWithEmail, createNotionPages, updateNotionPages } = require('./Controllers/Notion');



app.use(cors())
app.use(express.json());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'build')))
app.use(express.static(path.join(__dirname, 'tutorly-sheet-update-build')))
app.use(express.static(path.join(__dirname, 'white-board')))


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

app.get("/joinWhiteboard", (req, res) => {
  res.sendFile(path.join(__dirname, "white-board/index.html"))
})

app.get("/updateMapleSheets", (req, res) => {
  mapleSheetUpdate()
  res.send("Please check Maple sessions sheet, it will update in few seconds..")
})



app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build/index.html"))
})

// const io = require("socket.io")(8080, {
//   cors: {
//       origin: "*"
//   }
// });

// io.on("connection", (socket) => {
//   socket.on("syncBoard", (dataURL, currentPageSource) => {
//       console.log("Board data received on server..");
//       socket.to("board").emit("received", { dataURL, currentPageSource });
//   })
//   socket.on("syncErasedData", (eraserData, currentPageSource, dataURL) => {
//     socket.to("board").emit("eraseData", { eraserData, currentPageSource, dataURL });
//   })
//   socket.on("addText", (currentPageSource, dataURL) => {
//     socket.to("board").emit("addText", { currentPageSource, dataURL });
//   })
//   socket.on("addPage", () => {
//     socket.to("board").emit("addPage");
//   })
//   socket.on("joinWhiteBoard", (board) => {
//       socket.join(board);
//       console.log("Joined board");
//   })  
//   socket.on("undo", (dataURL, currentPageSource, x, y, index) => {
//     console.log(currentPageSource, x, y, index);
//     socket.to("board").emit("undo", { dataURL, currentPageSource, x, y, index });
//   })
//   socket.on("redo", (undoObj) => {
//     socket.to("board").emit("redo", { undoObj });
//   })
//   socket.on("syncImage", (imageUrl, currentPageSource) => {
//     socket.to("board").emit("syncImage", { imageUrl, currentPageSource });
//   })
// })



app.listen("4005", () => {
  // 4f9e229effac4b2a86f2a874c9c849e1
  //createNotionPageWithEmail("gracebernal@mapleschool.org")
  //updateStudentIds()
  //printCalenderId("awaish@tutorly.com")
  //googleSheetDataTutor(null, null)
  //createNotionPages()
  //updateNotionPages()
  //mapleSheetUpdate()
  console.log("server running");
})