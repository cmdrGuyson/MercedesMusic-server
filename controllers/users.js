const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const { JWT_SECRET } = require("../config/env.json");

const Admin = require("../models/admin");
const Room = require("../models/room");
const { response } = require("express");
const { request } = require("http");

/* DEV ROUTE TO CREATE ADMIN (won't be publicly exposed) */
exports.admin_create = async (request, response) => {
  try {
    const username = "admin";
    let password = "password";

    const user = await Admin.findOne({ username: username });

    if (user)
      return response
        .status(400)
        .json({ error: { username: "User already exists" } });

    //Hash password
    password = await bcrypt.hash(password, 6);

    const admin = {
      username,
      password,
    };

    const created_admin = await Admin.create(admin);

    return response.status(201).json({ created_admin });
  } catch (error) {
    console.log(error);
    return response.status(500).json({ error });
  }
};

/* DEV ROUTE TO CREATE ADMIN (won't be publicly exposed) */
exports.admin_create_1 = async (request, response) => {
  try {
    const username = request.body.username;

    if (!username)
      return response.status(400).json({ error: "Username required" });

    let password = "password";

    const user = await Admin.findOne({ username: username });

    if (user)
      return response
        .status(400)
        .json({ error: { username: "User already exists" } });

    //Hash password
    password = await bcrypt.hash(password, 6);

    const admin = {
      username,
      password,
    };

    const created_admin = await Admin.create(admin);

    return response.status(201).json({ created_admin });
  } catch (error) {
    console.log(error);
    return response.status(500).json({ error });
  }
};

/* ADMIN LOGIN */
exports.admin_login = async (request, response) => {
  const { username, password } = request.body;
  let errors = {};
  try {
    if (!username || username.trim() === "")
      errors.username = "Email must not be empty";
    if (!password || password === "")
      errors.password = "Password must not be empty";

    //If there are any errors return response JSON with errors
    if (Object.keys(errors).length > 0)
      return response.status(400).json({ error: errors });

    const user = await Admin.findOne({ username: username });

    if (!user)
      return response
        .status(404)
        .json({ error: { username: "User not found" } });

    //Check password
    const correctPassword = await bcrypt.compare(password, user.password);

    if (!correctPassword) {
      errors.password = "Password is incorrect";
      return response.status(400).json({ error: errors });
    }

    //Generate JWT
    let token = jwt.sign({ user }, JWT_SECRET, { expiresIn: 2 * 60 * 60 });

    return response.json({ token });
  } catch (error) {
    //console.log(error);
    return response.status(500).json({ error });
  }
};

/* CREATE ROOM */
exports.room_create = async (request, response) => {
  try {
    const roomName = request.body.name;

    let accessCode = crypto.randomBytes(5).toString("hex");

    //TBD :: Check if access code is unique
    let roomsWithSameAccessCode = await Room.find({ accessCode });

    while (!roomsWithSameAccessCode) {
      accessCode = crypto.randomBytes(5).toString("hex");
      roomsWithSameAccessCode = await Room.find({ accessCode });
    }

    // Get dealership id
    const dealership = request.user.dealership;

    // Check if room by same name exists for dealership
    const rooms = await Room.find({
      $and: [{ name: roomName }, { dealership }],
    });

    if (rooms.length > 0)
      return response.status(400).json({ error: "Room exists" });

    const room = await Room.create({
      name: roomName,
      accessCode,
      dealership,
    });

    return response.status(201).json({ room });
  } catch (error) {
    console.log(error);
    return response.status(500).json({ error });
  }
};

/* LOGIN WITH ROOMCODE */
exports.room_login = async (request, response) => {
  try {
    const accessCode = request.body.accessCode;

    if (!accessCode)
      return response.status(400).json({
        error: "Access code is required",
      });

    const room = await Room.findOne({ accessCode });

    if (!room) response.status(400).json({ error: "Access code invalid" });

    //Generate JWT
    let token = jwt.sign({ room }, JWT_SECRET, { expiresIn: 10 * 60 * 60 });

    return response.json({ token });
  } catch (error) {
    return response.status(500).json({ error });
  }
};

/* GET ALL ROOMS OF DEALERSHIP */
exports.get_rooms = async (request, response) => {
  try {
    const dealership = request.user.dealership;

    const rooms = await Room.find({ dealership });

    return response.status(200).json({ rooms });
  } catch (error) {
    return response.status(500).json({ error });
  }
};

/* GET LOGGED IN ROOM OBJECT */
exports.get_logged_room = async (request, response) => {
  try {
    const room = request.room;

    if (!room) response.status(403).json({ error: "Unauthorized" });

    return response.status(200).json({ room });
  } catch (error) {
    return response.status(500).json({ error });
  }
};

exports.set_room_token = async (request, response) => {
  try {
    const roomId = request.room._id;

    const token = request.body.token;

    if (!token)
      return response.status(400).json({ error: "Token is required" });

    const room = await Room.findById(roomId).orFail();

    room.fcmToken = token;

    const result = await room.save();

    return response.status(200).json({ room: result });
  } catch (error) {
    return response.status(500).json({ error });
  }
};
