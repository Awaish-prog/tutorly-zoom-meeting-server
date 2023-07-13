// const io = require("socket.io")(8080, {
//     cors: {
//         origin: "*"
//     }
//   });
  
//   io.on("connection", (socket) => {
//     socket.on("syncBoard", (dataURL, currentPageSource) => {
//         console.log("Board data received on server..");
//         socket.to("board").emit("received", { dataURL, currentPageSource });
//     })
//     socket.on("syncErasedData", (eraserData, currentPageSource, dataURL) => {
//       socket.to("board").emit("eraseData", { eraserData, currentPageSource, dataURL });
//     })
//     socket.on("addText", (currentPageSource, dataURL) => {
//       socket.to("board").emit("addText", { currentPageSource, dataURL });
//     })
//     socket.on("addPage", () => {
//       socket.to("board").emit("addPage");
//     })
//     socket.on("joinWhiteBoard", (board) => {
//         socket.join(board);
//         console.log("Joined board");
//     })  
//     socket.on("undo", (dataURL, currentPageSource, x, y, index, obj) => {
//       console.log(currentPageSource, x, y, index);
//       socket.to("board").emit("undo", { dataURL, currentPageSource, x, y, index, obj });
//     })
//     socket.on("redo", (undoObj, index) => {
//       socket.to("board").emit("redo", { undoObj, index });
//     })
//     socket.on("syncImage", (imageData, currentPageSource, imageX, imageY, imageWidth, imageHeight, dataURL) => {
//       socket.to("board").emit("syncImage", { imageData, currentPageSource, imageX, imageY, imageWidth, imageHeight, dataURL });
//     })
//   })