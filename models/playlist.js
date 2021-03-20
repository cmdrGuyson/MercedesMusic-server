const { model, Schema } = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const playlistSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Must not be empty"],
    },
    songs: [
      {
        type: Schema.Types.ObjectId,
        ref: "Song",
      },
    ],
  },
  { timestamps: true }
);

const Playlist = model("Playlist", playlistSchema);

module.exports = Playlist;
