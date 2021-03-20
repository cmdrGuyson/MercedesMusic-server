const { sendNotificationToClient } = require("../firebase/notify");
const Playlist = require("../models/playlist");
const Room = require("../models/room");

exports.addMessage = async (req, res) => {
  const { name, message } = req.body;
  const columns = "name, message";
  const values = `'${name}', '${message}'`;
  try {
    //const data = await messagesModel.insertWithReturn(columns, values);
    const tokens = [
      "eaBwibWQzlqyEr0Q1mhOvI:APA91bEFvvgS5P76tOKVejtW8MixEGAJ_I_t8G5NnFg9HPw9129Agw2d1HOkWmBdATq1JMajLaoTEaZJcpwTQjWP4JmDLU-MqG9G8ap8wwSG8ItvZZo14TNC8R3swEMUOx8yonuYJhLw",
    ];
    const notificationData = {
      title: "New message",
      body: "message",
    };
    sendNotificationToClient(tokens, notificationData);
    res.status(200).json({ messages: notificationData });
  } catch (err) {
    res.status(400).json({ messages: err.stack });
  }
};

exports.playlist = async (request, response) => {
  const { roomId, playlistId } = request.body;

  try {
    const room = await Room.findById(roomId).orFail();
    const token = room.fcmToken;

    if (!token)
      return response.status(400).json({ error: "FCM token missing in room" });

    const playlist = await Playlist.findById(playlistId).orFail();

    const result = {
      action: "PLAYLIST",
      body: playlistId,
    };

    sendNotificationToClient([token], result);

    return response.status(200).json(result);
  } catch (err) {
    response.status(200).json({ messages: err.stack });
  }
};

exports.volume = async (request, response) => {
  const { roomId, volume } = request.body;

  try {
    const room = await Room.findById(roomId).orFail();
    const token = room.fcmToken;

    if (!token)
      return response.status(400).json({ error: "FCM token missing in room" });

    const result = {
      action: "VOLUME",
      body: volume,
    };

    sendNotificationToClient([token], result);

    return response.status(200).json(result);
  } catch (err) {
    response.status(200).json({ messages: err.stack });
  }
};
