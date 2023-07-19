const express = require('express');
const { getPreviousMeetings, getUpcomingMeetings, rescheduleMeeting, cancelMeeting, getAvailability, printCalenderId } = require('./Controllers/Meetings');
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser');
const { downloadRecording } = require('./Controllers/ZoomWebhook.js');
const { getDashboardData, googleSheetTest, updateStudentIds, googleSheetDataTutor, getMapleStudent, mapleSheetUpdate, getDashboardDataTest, saveWhiteboardData } = require('./Controllers/DashboardData.js');
const { login } = require('./Controllers/User.js');
const { authentication } = require('./Middlewares/Authenticate.js');
const path = require('path');
const { createNotionPageWithEmail, createNotionPages, updateNotionPages } = require('./Controllers/Notion.js');
const { searchFolder } = require('./Controllers/GoogleDrive.js');
const { createWhiteboardData, updateWhiteboard, getWhiteboardData, deleteWhiteboardData } = require('./Controllers/WhiteBoardAppScripts.js');






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
  
  
  socket.on("syncBoard", (dataURL, currentPageSource) => {
      socket.to("board").emit("received", { dataURL, currentPageSource });
      boards[b].contexts[currentPageSource] = dataURL
      const undoObj = {
        dataURL: dataURL,
        page: currentPageSource,
        x: -1,
        y: -1
      }
      
  })

  socket.on("syncErasedData", (eraserData, currentPageSource, dataURL) => {
    socket.to("board").emit("eraseData", { eraserData, currentPageSource, dataURL });
    const undoObj = {
      dataURL: dataURL,
      page: currentPageSource,
      x: -1,
      y: -1
    }
    boards[b].contexts[currentPageSource] = dataURL
    
  })
  socket.on("addText", (currentPageSource, dataURL) => {
    socket.to("board").emit("addText", { currentPageSource, dataURL });
    const undoObj = {
      dataURL: dataURL,
      page: currentPageSource,
      x: -1,
      y: -1
    }
    boards[b].contexts[currentPageSource] = dataURL
    
  })

  socket.on("addPage", () => {
    socket.to("board").emit("addPage");
    boards[b].contexts.push(null)
    boards[b].pages.push(boards[b].pages[boards[b].pages.length - 1] + 1)
    
  })

  socket.on("joinWhiteBoard", async (board) => {
      socket.join(board);
      socket.emit("Joined", await getWhiteboardData("http://localhost:4005/joinWhiteboard/U2FsdGVkX1/mdJeS6NNL1gyXqB8USjWQpZ5qfvjuac5Z3Kka5+9QggQ9Zi3dxkklj/mlgSXX03HmNAMTSUp1hnODSjm8GQ3HB1g8kWraokc="))
      if(board in boards){
        
        
      }
      else{
        b = board
        boards[board] = { contexts: [null], pages: [0], images: [] }
      }
     
      const boardKeys = Object.keys(boards)
      console.log(Object.keys(boards));
      for(let i = 0; i < boardKeys.length; i++){
        if(!getNumberOfClients(boardKeys[i])){
          delete boards[boardKeys[i]]
        }
      }
      console.log(getNumberOfClients("board"));
      console.log("Joined board"); 
  }) 
  
  socket.on("saveData", (board) => {
    saveWhiteboardData(JSON.stringify(boards[board]), board)
    const jsonString = JSON.stringify(boards[board]);
    console.log("String length: " + jsonString.length);
    const arr = breakStringIntoSections(jsonString, 49990)
    const val = recreateString(arr)
    console.log("cells required: " + arr.length);
    console.log("Recreated string length: " + val.length);
    console.log(val === jsonString);
    updateWhiteboard("http://localhost:4005/joinWhiteboard/U2FsdGVkX1/mdJeS6NNL1gyXqB8USjWQpZ5qfvjuac5Z3Kka5+9QggQ9Zi3dxkklj/mlgSXX03HmNAMTSUp1hnODSjm8GQ3HB1g8kWraokc=", arr)
  })

  socket.on("undo", (dataURL, currentPageSource, x, y, index, obj) => {
    socket.to("board").emit("undo", { dataURL, currentPageSource, x, y, index, obj });
    boards[b].contexts[currentPageSource] = dataURL
    console.log(x, y);
    for(let i = 0; i < boards[b].images.length; i++){
      if(boards[b].images[i].x === x && boards[b].images[i].y === y && boards[b].images[i].page === currentPageSource){
        boards[b].images.splice(i, 1)
        console.log("found");
        break;
      }
    }
    
  })

  socket.on("redo", (undoObj, index) => {
    socket.to("board").emit("redo", { undoObj, index });
    boards[b].contexts[undoObj.page] = undoObj.dataURL
  })

  socket.on("syncImage", (imageData, currentPageSource, imageX, imageY, imageWidth, imageHeight, dataURL) => {
    socket.to("board").emit("syncImage", { imageData, currentPageSource, imageX, imageY, imageWidth, imageHeight, dataURL });
    boards[b].images.push({ imageData, x : imageX, y : imageY, page: currentPageSource, imageWidth, imageHeight })
    const undoObj = {
      dataURL: dataURL,
      page: currentPageSource,
      x: imageX,
      y: imageY
    }
  })
  
})





app.listen("4005", () => {
  // 4f9e229effac4b2a86f2a874c9c849e1
  //createNotionPageWithEmail("gracebernal@mapleschool.org")
  //updateStudentIds()
  //printCalenderId("awaish@tutorly.com")
  //googleSheetDataTutor(null, null)
  //createNotionPages()
  //updateNotionPages()
  //mapleSheetUpdate()
  //getDataFromGoogleAppsScript();
  // console.log("fivefivefivefivefivefivefivefiv");
  // console.log(recreateString(breakStringIntoSections("fivefivefivefivefivefivefivefiv", 4)));
  //deleteWhiteboardData("ddd")
  // https://script.google.com/macros/s/AKfycbwSBXVjJCPcpLFE1UhE-hWSkTpxBqZLJNgdUCKNIx4XcP9MldjNB1DgUfPwsvmG9ovJ/exec
  console.log("server running");
})