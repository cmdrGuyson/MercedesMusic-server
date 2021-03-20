const { model, Schema } = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const songSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Must not be empty"],
    },
    url: {
      type: String,
      required: [true, "Must not be empty"],
    },
  },
  { timestamps: true }
);

const Song = model("Song", songSchema);

module.exports = Song;
