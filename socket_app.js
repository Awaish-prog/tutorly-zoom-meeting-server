// const io = require("socket.io")(8080, {
//     cors: {
//         origin: "*"
//     }
//   });
  
//   const boards = { }
//   let b = null
  
  
  
//   io.on("connection", (socket) => {
  
//     function getNumberOfClients(roomName){
//       const rooms = socket.adapter.rooms
//       if(rooms && rooms.has(roomName)){
//         return rooms.get(roomName).size
//       }
//       else {
//         return 0;
//       }
//     }
    
//     socket.on("syncBoard", (dataURL, currentPageSource) => {
//         socket.to("board").emit("received", { dataURL, currentPageSource });
//         console.log("Board data received on server..");
//         boards[b].contexts[currentPageSource] = dataURL
//         const undoObj = {
//           dataURL: dataURL,
//           page: currentPageSource,
//           x: -1,
//           y: -1
//         }
//         boards[b].undoStack.push(undoObj)
        
//     })
  
//     socket.on("syncErasedData", (eraserData, currentPageSource, dataURL) => {
//       socket.to("board").emit("eraseData", { eraserData, currentPageSource, dataURL });
//       const undoObj = {
//         dataURL: dataURL,
//         page: currentPageSource,
//         x: -1,
//         y: -1
//       }
//       boards[b].undoStack.push(undoObj)
//       boards[b].contexts[currentPageSource] = dataURL
      
//     })
//     socket.on("addText", (currentPageSource, dataURL) => {
//       socket.to("board").emit("addText", { currentPageSource, dataURL });
//       const undoObj = {
//         dataURL: dataURL,
//         page: currentPageSource,
//         x: -1,
//         y: -1
//       }
//       boards[b].undoStack.push(undoObj)
//       boards[b].contexts[currentPageSource] = dataURL
      
//     })
  
//     socket.on("addPage", () => {
//       socket.to("board").emit("addPage");
//       boards[b].contexts.push(null)
//       boards[b].pages.push(boards[b].pages[boards[b].pages.length - 1] + 1)
      
//     })
  
//     socket.on("joinWhiteBoard", (board) => {
//         socket.join(board);
//         if(board in boards){
//           socket.emit("Joined", boards[board])
//         }
//         else{
//           b = board
//           boards[board] = { contexts: [null], pages: [0], images: [], undoStack: [], redoStack: [] }
//         }
       
//         const boardKeys = Object.keys(boards)
//         console.log(Object.keys(boards));
//         for(let i = 0; i < boardKeys.length; i++){
//           if(!getNumberOfClients(boardKeys[i])){
//             delete boards[boardKeys[i]]
//           }
//         }
//         console.log(getNumberOfClients("board"));
//         console.log("Joined board"); 
//     }) 
    
//     socket.on("saveData", (board) => {
//       //saveWhiteboardData(boards[board], board)
//     })
  
//     socket.on("undo", (dataURL, currentPageSource, x, y, index, obj) => {
//       socket.to("board").emit("undo", { dataURL, currentPageSource, x, y, index, obj });
//       boards[b].undoStack.splice(index, 1)
//       boards[b].redoStack.push(obj)
//       boards[b].contexts[currentPageSource] = dataURL
//       console.log(x, y);
//       for(let i = 0; i < boards[b].images.length; i++){
//         if(boards[b].images[i].x === x && boards[b].images[i].y === y && boards[b].images[i].page === currentPageSource){
//           boards[b].images.splice(i, 1)
//           console.log("found");
//           break;
//         }
//       }
      
//     })
  
//     socket.on("redo", (undoObj, index) => {
//       socket.to("board").emit("redo", { undoObj, index });
//       boards[b].redoStack.splice(index, 1)
//       boards[b].undoStack.push(undoObj)
//       boards[b].contexts[undoObj.page] = undoObj.dataURL
//     })
  
//     socket.on("syncImage", (imageData, currentPageSource, imageX, imageY, imageWidth, imageHeight, dataURL) => {
//       socket.to("board").emit("syncImage", { imageData, currentPageSource, imageX, imageY, imageWidth, imageHeight, dataURL });
//       boards[b].images.push({ imageData, x : imageX, y : imageY, page: currentPageSource, imageWidth, imageHeight })
//       const undoObj = {
//         dataURL: dataURL,
//         page: currentPageSource,
//         x: imageX,
//         y: imageY
//       }
//       boards[b].undoStack.push(undoObj)
//     })
    
//   })
  
  