require("dotenv").config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const http = require("http");
const auth = require("./middleware/auth");

const {
  admin_create,
  admin_login,
  room_create,
  room_login,
  get_rooms,
  get_logged_room,
  set_room_token,
} = require("./controllers/users");

const {
  upload_song,
  create_playlist,
  add_to_playlist,
  get_all_songs,
  get_all_playlists,
  get_playlist,
} = require("./controllers/songs");

const { addMessage, playlist, volume } = require("./controllers/notifications");

const app = express();

app.use(cors());
app.use(express.json());

/* Log HTTP requests */
app.use(morgan("dev"));

app.get("/", (request, response) => {
  return response.status(200).json({ message: "Hello world!" });
});

app.post("/admin-create", admin_create);
app.post("/admin-login", admin_login);
app.get("/logged-room", auth(), get_logged_room);
app.post("/room-token", auth(), set_room_token);

app.post("/room-create", auth("admin"), room_create);
app.post("/room-login", room_login);
app.get("/dealership-rooms", auth("admin"), get_rooms);

app.post("/add-song", auth("admin"), upload_song);
app.post("/create-playlist", auth("admin"), create_playlist);
app.post("/playlist-add/:id", auth("admin"), add_to_playlist);
app.get("/songs", auth(), get_all_songs);
app.get("/playlists", auth(), get_all_playlists);
app.get("/playlist/:id", auth(), get_playlist);

app.post("/message", addMessage);
app.post("/play-playlist", auth("admin"), playlist);
app.post("/change-volume", auth("admin"), volume);

module.exports = http.createServer(app);
