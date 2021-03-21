const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/env.json");

const Admin = require("../models/admin");
const Room = require("../models/room");

module.exports = (admin) => async (request, response, next) => {
  let token;
  if (
    //Check if bearer token exists
    request.headers.authorization &&
    request.headers.authorization.startsWith("Bearer ")
  ) {
    //Get bearer token
    token = request.headers.authorization.split("Bearer ")[1];
  } else {
    //console.error("No token found");
    return response.status(403).json({ error: "Unauthorized" });
  }

  let auth_token;

  jwt.verify(token, JWT_SECRET, (error, decodedToken) => {
    auth_token = decodedToken;
  });

  //If token is not succesfully decoded
  if (!auth_token) return response.status(403).json({ error: "Unauthorized" });

  let user;
  let room;

  try {
    //If user is an administrator
    if (auth_token.user) {
      //Check if user exists
      user = await Admin.findOne({
        username: auth_token.user.username,
      }).select(["-password"]);

      request.user = user;
    } else {
      console.log("room", auth_token.room);
      room = await Room.findById(auth_token.room._id);
      console.log(room);
      request.room = room;
    }
  } catch (error) {
    console.log(error);
    return response.status(500).json({ error });
  }

  //If user doesnt exist send error response
  if (!user && !room)
    return response.status(403).json({ error: "Unauthorized" });

  //If using as admin authorization middleware. check if user is admin
  if (admin === "admin") {
    if (!user) {
      return response.status(403).json({ error: "Unauthorized" });
    }
  }

  return next();
};
