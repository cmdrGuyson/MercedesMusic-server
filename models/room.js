const { model, Schema } = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const roomSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Must not be empty"],
    },
    accessCode: {
      type: String,
      required: [true, "Must not be empty"],
    },
    dealership: {
      type: String,
      required: [true, "Must not be empty"],
    },
    fcmToken: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

const Room = model("Room", roomSchema);

module.exports = Room;
