const server = require("./server");
const mongoose = require("mongoose");

const port = process.env.PORT || 5000;
const password = process.env.DATABASE_PASSWORD;

const URL = `mongodb+srv://guyson:${password}@cluster0.r1dm7.mongodb.net/StartHack?retryWrites=true&w=majority`;

// const socketIo = require("socket.io");
// const io = socketIo(server);

// //Whenever someone connects this gets executed
// io.on("connection", function (socket) {
//   console.log("A user connected");

//   //Whenever someone disconnects this piece of code executed
//   socket.on("disconnect", function () {
//     console.log("A user disconnected");
//   });
// });

server.listen(port, () => {
  console.log(`Server online`);
  /* Connect to database */
  mongoose
    .connect(URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    })
    .then(() => {
      console.log("Connected to database!");
    })
    .catch((error) => {
      console.log(error);
    });
});
