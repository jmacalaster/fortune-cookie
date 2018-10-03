var axios = require("axios");
var db = require("../models");
var bot = require("../lib/slackbot.js");

var env_token = process.env.BOT_ACCESS_TOKEN;

module.exports = function (app) {
  app.post("/slack/actions/submit", function (req, res) {
    var payload = JSON.parse(req.body.payload)
    var text = payload.submission.newFortune;
    var user = payload.user.id;
    db.User.findOne({
      where: {
        address: user
      }
    }).then(function (data) {
      if (data) {
        // Post new fortune
        axios.post(req.protocol + "://" + req.hostname + "/api/fortunes", {
          text: text,
          fromUserId: data.id
        }).then(function (response) {
          // New fortune posted with no error
          res.status(200).send();
          bot.sendMessage(data.name, "Thank you for creating your very own fortune!");
          // Send a chat message in response
          // axios.post("https://slack.com/api/chat.postMessage", {
          //   // channel_id,
          //   channel: user,
          //   text: "Thanks a bunch! You’re super awesome!"
          // },
          // {
          //   headers: { Authorization: `Bearer ${env_token}` }
          // }).then(function (messageRes){

          // }).catch(function (err){
          //   console.error(err);
          // });
        }).catch(function (err) {
          console.error(err);
        });
      }
      else {
      return res.status(200).json({
        "response_type": "ephemeral",
        "text": "You haven't signed up for Fortune Cookie yet! Type /signup to do so!"
      });
    }
    })
  });

app.post("/slack/commands/signup", (req, res) => {
  db.User.findOne({
    where: {
      address: req.body.user_id
    }
  }).then(function (data) {
    if (data) {
      return res.status(200).json({
        "response_type": "ephemeral",
        "text": "You're already signed up! No need to do so again."
      });
    }
    var newUser = {
      name: req.body.user_name,
      address: req.body.user_id,
      platform: "slack"
    };
    db.User.create(newUser).then(function (data) {
      res.status(200).json({
        "response_type": "in_channel",
        "text": "Welcome to the Fortune Cookie family, " + data.name + "!"
      });
    });
  });
});

app.post("/slack/commands/create", (req, res) => {
  let { token, text, username, command, response_url, trigger_id, user_id, channel_name, channel_id } = req.body

  axios.post(`https://slack.com/api/dialog.open`, {
    trigger_id,
    dialog: {
      "callback_id": "create_fortune",
      "title": "Create a fortune",
      "submit_label": "Submit",
      "state": "create",
      "elements": [
        {
          "type": "text",
          "label": "Enter fortune below",
          "name": "newFortune"
        }
      ]
    },
  },
    {
      headers: { Authorization: `Bearer ${env_token}` }
    }).then(response => {
      res.status(200).send("")
    })
})}
