const { messaging } = require("../admin");

exports.sendNotificationToClient = (tokens, data) => {
  // Send a message to the devices corresponding to the provided
  // registration tokens.
  messaging
    .sendMulticast({ tokens, data })
    .then((response) => {
      // Response is an object of the form { responses: [] }
      const successes = response.responses.filter((r) => r.success === true)
        .length;
      const failures = response.responses.filter((r) => r.success === false)
        .length;
      console.log(
        "Notifications sent:",
        `${successes} successful, ${failures} failed`
      );
    })
    .catch((error) => {
      console.log("Error sending message:", error);
    });
};
