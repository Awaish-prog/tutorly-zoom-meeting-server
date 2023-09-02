const { populateConversationStore, getChannels, initializeSlackIds, getChat, getReplies, postMessage, getUserName, updateUsersAndReads, getNotification, checkNotification, markMessageAsReadSocket, getSlackFileUrl } = require('./Controllers/Slack');
const express = require('express');
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser');
app.use(cors())
app.use(express.json());
app.use(bodyParser.json());

let outer_socket = null

const io = require("socket.io")(8081, {
    cors: {
        origin: "*"
    }
});


app.post("/slackapp/slackMessage", (req, res) => {
    req.body.event.userName = getUserName(req.body.event.user)
    
    console.log(req.body.event);

    const event = {
      userName: req.body.event.userName,
      ts: req.body.event.ts,
      channel: req.body.event.channel,
      event_ts: req.body.event.event_ts,
      text: req.body.event.text,
      user: req.body.event.user,
      type: req.body.event.type,
      thread_ts: req.body.event.thread_ts
    }
  
    
    
    outer_socket.emit("sendNotification")
    outer_socket.emit("sendMessage", event)
    console.log(outer_socket.emit)
    console.log("Received");
    
    updateUsersAndReads(req.body);
})

  
  
io.on("connection", (socket) => {
    outer_socket = socket
    console.log("connected");
  
    socket.on("postMessage", (channel, userName, text, showThread, ts) => {
        postMessage(channel, userName, text, showThread, ts)
    })
  
    socket.on("markMessageAsRead", (email, channel) => {
      markMessageAsReadSocket(email, channel);
    })
})

app.listen("8080", async () => {
    initializeSlackIds()
    console.log("Socket running...");
})

//module.exports = { sendMessageToClient }


// const { updateWhiteboard, getWhiteboardData, deleteWhiteboardData, checkLink } = require('./Controllers/WhiteBoardAppScripts.js');

// const v8 = require('v8');

// const io = require("socket.io")(8080, {
//     cors: {
//         origin: "*"
//     }
//   });
  
//   const boards = { }
  
  
  
  
//   io.on("connection", (socket) => {

//     const dataLimit = 5000000
//     function getObjectSize(object) {
//       const serializedObject = v8.serialize(object);
//       return Buffer.byteLength(serializedObject);
//     }
  
//     function getNumberOfClients(roomName){
//       const rooms = socket.adapter.rooms
//       if(rooms && rooms.has(roomName)){
//         return rooms.get(roomName).size
//       }
//       else {
//         return 0;
//       }
//     }
  
//     function sleep(ms) {
//       return new Promise(resolve => setTimeout(resolve, ms));
//     }
  
//     function breakStringIntoSections(str, sectionLength) {
//       var sections = [];
//       for (var i = 0; i < str.length; i += sectionLength) {
//         sections.push(str.substr(i, sectionLength));
//       }
//       return sections;
//     }
    
//     function recreateString(stringArr){
//       let str = ""
//       for(let i = 0; i < stringArr.length; i++){
//         str += stringArr[i]
//       }
//       return str
//     }
    
    
//     socket.on("syncBoard", (dataURL, currentPageSource, board) => {
//       if(getObjectSize(boards[board]) > dataLimit){
//         socket.to(board).emit("dataLimit");
//         socket.emit("dataLimit");
//         const jsonString = JSON.stringify(boards[board]);
//         const arr = breakStringIntoSections(jsonString, 49990)
//         updateWhiteboard(board, arr)
//         delete boards[board]
//         return
//       }
//       socket.to(board).emit("received", { dataURL, currentPageSource });
//       boards[board].contexts[currentPageSource] = dataURL
        
//     })
  
//     socket.on("syncErasedData", (eraserData, currentPageSource, dataURL, board) => {
//       if(getObjectSize(boards[board]) > dataLimit){
//         socket.to(board).emit("dataLimit");
//         socket.emit("dataLimit");
//         const jsonString = JSON.stringify(boards[board]);
//         const arr = breakStringIntoSections(jsonString, 49990)
//         updateWhiteboard(board, arr)
//         delete boards[board]
//         return
//       }
//       socket.to(board).emit("eraseData", { eraserData, currentPageSource, dataURL });
//       boards[board].contexts[currentPageSource] = dataURL
//     })
//     socket.on("addText", (currentPageSource, dataURL, board) => {
//       if(getObjectSize(boards[board]) > dataLimit){
//         socket.to(board).emit("dataLimit");
//         socket.emit("dataLimit");
//         const jsonString = JSON.stringify(boards[board]);
//         const arr = breakStringIntoSections(jsonString, 49990)
//         updateWhiteboard(board, arr)
//         delete boards[board]
//         return
//       }
//       socket.to(board).emit("addText", { currentPageSource, dataURL });
//       boards[board].contexts[currentPageSource] = dataURL
//     })
  
//     socket.on("addPage", (board) => {
//       if(getObjectSize(boards[board]) > dataLimit){
//         socket.to(board).emit("dataLimit");
//         socket.emit("dataLimit");
//         const jsonString = JSON.stringify(boards[board]);
//         const arr = breakStringIntoSections(jsonString, 49990)
//         updateWhiteboard(board, arr)
//         delete boards[board]
//         return
//       }
//       socket.to(board).emit("addPage");
//       boards[board].contexts.push(null)
//       boards[board].pages.push(boards[board].pages[boards[board].pages.length - 1] + 1)
//       boards[board].grid.push(0)
//     })
  
//     socket.on("lock", (board) => {
  
//       socket.to(board).emit("lock");
//     })
  
//     socket.on("joinWhiteBoard", async (board) => {
//         const joinStatus = await checkLink(board)
//         if(joinStatus !== 200){
//           socket.emit("wrongLink")
//           return
//         }
//         socket.join(board);
        
//         if(board in boards){
//           socket.emit("Joined", boards[board])
//         }
//         else{
//           const boardData = await getWhiteboardData(board)
//           if(boardData){
//             socket.emit("Joined", boardData)
//             boards[board] = boardData
//           }
//           else{
//             boards[board] = { contexts: [null], pages: [0], images: [], grid: [0] }
//             socket.emit("Joined", boards[board])
//           }
//         }
       
//         const boardKeys = Object.keys(boards)
  
//         for(let i = 0; i < boardKeys.length; i++){
//           if(!getNumberOfClients(boardKeys[i])){
//             const jsonString = JSON.stringify(boards[boardKeys[i]]);
//             const arr = breakStringIntoSections(jsonString, 49990)
//             updateWhiteboard(boardKeys[i], arr)
//             delete boards[boardKeys[i]]
//             await sleep(3000);
//             console.log("Saved: " + boardKeys[i]);
//           }
//         }
        
//         console.log("Joined board"); 
//     }) 
    
//     // socket.on("saveData", (board) => {
//     //   const jsonString = JSON.stringify(boards[board]);
//     //   console.log("String length: " + jsonString.length);
//     //   console.log(getObjectSize(boards[board]) + " bytes");
//     // })
  
//     socket.on("undo", (dataURL, currentPageSource, x, y, index, obj, board) => {
//       if(getObjectSize(boards[board]) > dataLimit){
//         socket.to(board).emit("dataLimit");
//         socket.emit("dataLimit");
//         const jsonString = JSON.stringify(boards[board]);
//         const arr = breakStringIntoSections(jsonString, 49990)
//         updateWhiteboard(board, arr)
//         delete boards[board]
//         return
//       }
//       socket.to(board).emit("undo", { dataURL, currentPageSource, x, y, index, obj });
//       boards[board].contexts[currentPageSource] = dataURL
      
//       for(let i = 0; i < boards[board].images.length; i++){
//         if(boards[board].images[i].x === x && boards[board].images[i].y === y && boards[board].images[i].page === currentPageSource){
//           boards[board].images.splice(i, 1)
//           console.log("found");
//           break;
//         }
//       }
      
//     })
  
//     socket.on("redo", (undoObj, index, board) => {
//       if(getObjectSize(boards[board]) > dataLimit){
//         socket.to(board).emit("dataLimit");
//         socket.emit("dataLimit");
//         const jsonString = JSON.stringify(boards[board]);
//         const arr = breakStringIntoSections(jsonString, 49990)
//         updateWhiteboard(board, arr)
//         delete boards[board]
//         return
//       }
//       socket.to(board).emit("redo", { undoObj, index });
//       boards[board].contexts[undoObj.page] = undoObj.dataURL
//     })
  
//     socket.on("syncImage", (imageData, currentPageSource, imageX, imageY, imageWidth, imageHeight, dataURL, board) => {
//       if(getObjectSize(boards[board]) > dataLimit){
//         socket.to(board).emit("dataLimit");
//         socket.emit("dataLimit");
//         const jsonString = JSON.stringify(boards[board]);
//         const arr = breakStringIntoSections(jsonString, 49990)
//         updateWhiteboard(board, arr)
//         delete boards[board]
//         return
//       }
//       socket.to(board).emit("syncImage", { imageData, currentPageSource, imageX, imageY, imageWidth, imageHeight, dataURL });
//       boards[board].images.push({ imageData, x : imageX, y : imageY, page: currentPageSource, imageWidth, imageHeight })
//     })
  
//     socket.on("Grid", (page, grid, board) => {
//       if(getObjectSize(boards[board]) > dataLimit){
//         socket.to(board).emit("dataLimit");
//         socket.emit("dataLimit");
//         const jsonString = JSON.stringify(boards[board]);
//         const arr = breakStringIntoSections(jsonString, 49990)
//         updateWhiteboard(board, arr)
//         delete boards[board]
//         return
//       }
//       socket.to(board).emit("Grid", { page, grid });
//       boards[board].grid[page] = grid
//     })
    
//   })
  

