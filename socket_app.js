const io = require("socket.io")(8080, {
    cors: {
        origin: "*"
    }
});

io.on("connection", (socket) => {
    socket.on("syncBoard", (dataURL) => {
        console.log("Board data received on server..");
        socket.to("board").emit("received", { dataURL });
    })
    socket.on("syncErasedData", (eraserData) => {
      socket.to("board").emit("eraseData", { eraserData });
  })
    socket.on("joinWhiteBoard", (board) => {
        socket.join(board);
        console.log("Joined board");
    })  
  })