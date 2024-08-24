const User = require("../models/User/User");
const pushNotification = require("../util/pushNotification");
const moment = require('moment-timezone');

exports.pushNotificationLogic = async (data) => {  
  try {
    let fcm_tokenarr = [];
    let userData = [];

    if (data.type === "ALL") {
      userData = await User.find(
        {
          $and: [
            { notification: { $ne: false } }, // Exclude users with notification: false
            {
              status: {
                $nin: ["BLOCKED", "DEACTIVATED"], // Exclude users with BLOCKED or DEACTIVATED status
              },
            },
          ],
        },
        { _id: 1, name: 1, fcmToken: 1 }
      );
    } else {
      userData = await User.find(
        {
          $and: [
            { _id: { $in: data.userList } }, // Include users in data.userList
            { notification: { $ne: false } }, // Exclude users with notification: false
            {
              status: {
                $nin: ["BLOCKED", "DEACTIVATED"], // Exclude users with BLOCKED or DEACTIVATED status
              },
            },
          ],
        },
        { _id: 1, name: 1, fcmToken: 1 }
      );
    }
    if (userData && userData.length) {
      userData.map((item) => {
        item.fcmToken && item.fcmToken != undefined
          ? fcm_tokenarr.push(item.fcmToken)
          : "";
      });
    }
    let title = data.title;
    let body = data.description;
    let payload = {
      data: {
        title,
        body,
      },
      notification: {
        title,
        body,
      },
    };
    let options = {
      priority: "high",
    };
    if (fcm_tokenarr.length > 0) {
      pushNotification
        .messaging()
        .sendToDevice(fcm_tokenarr, payload, options)
        .then(async (result) => {
          console.log(result, "notification result");
        })
        .catch((error) => {
          console.log(error, "debugging notification");
        });
    }
  } catch (err) {
    console.log(err, "err");
  }
};
exports.scheduleNotification = (startDate, startTime, notificationData) => {
  const timeZone = 'Asia/Kolkata';
  const scheduledDateTime = moment.tz(`${startDate} ${startTime}`, timeZone);
  const now = moment().tz(timeZone);

  const delay = scheduledDateTime - now;
  setTimeout(async () => {
    try {
      await exports.pushNotificationLogic(notificationData);
    } catch (error) {
      console.error("Error sending scheduled notification:", error.message);
    }
  }, delay);
};
