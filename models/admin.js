const { model, Schema } = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const adminSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      required: [true, "Must not be empty"],
    },
    password: {
      type: String,
      required: [true, "Must not be empty"],
    },
    dealership: {
      type: String,
      default: uuidv4(),
    },
  },
  { timestamps: true }
);

const Admin = model("Admin", adminSchema);

module.exports = Admin;
