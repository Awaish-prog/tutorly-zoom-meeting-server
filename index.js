const express = require('express');
const { getPreviousMeetings, getUpcomingMeetings, rescheduleMeeting, cancelMeeting, getAvailability, printCalenderId } = require('./Controllers/Meetings');
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser');
const { downloadRecording } = require('./Controllers/ZoomWebhook.js');
const { getDashboardData, googleSheetTest, updateStudentIds, googleSheetDataTutor, getMapleStudent, mapleSheetUpdate, getDashboardDataTest } = require('./Controllers/DashboardData.js');
const { login } = require('./Controllers/User.js');
const { authentication } = require('./Middlewares/Authenticate.js');
const path = require('path');
const { createNotionPageWithEmail, createNotionPages, updateNotionPages } = require('./Controllers/Notion.js');
const { searchFolder } = require('./Controllers/GoogleDrive.js');
const { createWhiteboardData, updateWhiteboard, getWhiteboardData, deleteWhiteboardData, checkLink, getBoardsList } = require('./Controllers/WhiteBoardAppScripts.js');






app.use(cors())
app.use(express.json());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'build')))
app.use(express.static(path.join(__dirname, 'tutorly-sheet-update-build')))
app.use(express.static(path.join(__dirname, 'white-board')))


app.get("/getPreviousMeetings/:email/:role/:number", authentication, getPreviousMeetings)

app.get("/getUpcomingMeetings/:email/:role/:number", authentication, getUpcomingMeetings)

app.post("/getEvent", downloadRecording )

app.post("/createWhiteboardData", authentication, createWhiteboardData )

app.post("/getBoardsList", authentication, getBoardsList )

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

app.get("/joinWhiteboard*", (req, res) => {
  res.sendFile(path.join(__dirname, "white-board/index.html"))
})

app.get("/updateMapleSheets", (req, res) => {
  mapleSheetUpdate()
  res.send("Please check Maple sessions sheet, it will update in few seconds..")
})



app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build/index.html"))
})

const io = require("socket.io")(8001, {
  cors: {
      origin: "*"
  }
});

const boards = { }
let b = null



io.on("connection", (socket) => {

  function getNumberOfClients(roomName){
    const rooms = socket.adapter.rooms
    if(rooms && rooms.has(roomName)){
      return rooms.get(roomName).size
    }
    else {
      return 0;
    }
  }

  function breakStringIntoSections(str, sectionLength) {
    var sections = [];
    for (var i = 0; i < str.length; i += sectionLength) {
      sections.push(str.substr(i, sectionLength));
    }
    return sections;
  }
  
  function recreateString(stringArr){
    let str = ""
    for(let i = 0; i < stringArr.length; i++){
      str += stringArr[i]
    }
    return str
  }
  
  
  socket.on("syncBoard", (dataURL, currentPageSource, board) => {
      socket.to(board).emit("received", { dataURL, currentPageSource });
      boards[board].contexts[currentPageSource] = dataURL
  })

  socket.on("syncErasedData", (eraserData, currentPageSource, dataURL, board) => {
    socket.to(board).emit("eraseData", { eraserData, currentPageSource, dataURL });
    boards[board].contexts[currentPageSource] = dataURL
  })
  socket.on("addText", (currentPageSource, dataURL, board) => {
    socket.to(board).emit("addText", { currentPageSource, dataURL });
    boards[board].contexts[currentPageSource] = dataURL
  })

  socket.on("addPage", (board) => {
    socket.to(board).emit("addPage");
    boards[board].contexts.push(null)
    boards[board].pages.push(boards[board].pages[boards[board].pages.length - 1] + 1)
    
  })

  socket.on("joinWhiteBoard", async (board) => {
      const joinStatus = await checkLink(board)
      if(joinStatus !== 200){
        socket.emit("wrongLink")
        return
      }
      socket.join(board);
      
      if(board in boards){
        socket.emit("Joined", boards[board])
      }
      else{
        const boardData = await getWhiteboardData(board)
        if(boardData){
          socket.emit("Joined", boardData)
          boards[board] = boardData
        }
        else{
          boards[board] = { contexts: [null], pages: [0], images: [] }
          socket.emit("Joined", boards[board])
        }
      }
     
      const boardKeys = Object.keys(boards)

      for(let i = 0; i < boardKeys.length; i++){
        if(!getNumberOfClients(boardKeys[i])){
          const jsonString = JSON.stringify(boards[boardKeys[i]]);
          const arr = breakStringIntoSections(jsonString, 49990)
          updateWhiteboard(boardKeys[i], arr)
          delete boards[boardKeys[i]]
        }
      }
      console.log(Object.keys(boards));
      console.log("Joined board"); 
  }) 
  
  socket.on("saveData", (board) => {
    const jsonString = JSON.stringify(boards[board]);
    console.log("String length: " + jsonString.length);
    const arr = breakStringIntoSections(jsonString, 49990)
    const val = recreateString(arr)
    console.log("cells required: " + arr.length);
    console.log("Recreated string length: " + val.length);
    console.log(val === jsonString);
    updateWhiteboard(board, arr)
  })

  socket.on("undo", (dataURL, currentPageSource, x, y, index, obj, board) => {
    socket.to(board).emit("undo", { dataURL, currentPageSource, x, y, index, obj });
    boards[board].contexts[currentPageSource] = dataURL
    
    for(let i = 0; i < boards[board].images.length; i++){
      if(boards[board].images[i].x === x && boards[board].images[i].y === y && boards[board].images[i].page === currentPageSource){
        boards[board].images.splice(i, 1)
        console.log("found");
        break;
      }
    }
    
  })

  socket.on("redo", (undoObj, index, board) => {
    socket.to(board).emit("redo", { undoObj, index });
    boards[board].contexts[undoObj.page] = undoObj.dataURL
  })

  socket.on("syncImage", (imageData, currentPageSource, imageX, imageY, imageWidth, imageHeight, dataURL, board) => {
    socket.to(board).emit("syncImage", { imageData, currentPageSource, imageX, imageY, imageWidth, imageHeight, dataURL });
    boards[board].images.push({ imageData, x : imageX, y : imageY, page: currentPageSource, imageWidth, imageHeight })
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
  
  console.log("server running");
})