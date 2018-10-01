var axios = require("axios");
var db = require("../models");

module.exports = function(app) {
  app.post("/slack/commands/signup", (req, res) => {
    console.log(req);
    db.User.findOne({
      where: {
        address: req.user_id
      }
    }).then(function(data) {
      if (data) {
        return res.status(400).send("User is already signed up.");
      }
      var newUser = {
        name: req.user_name,
        address: req.user_id,
        platform: "slack"
      };
      console.log(newUser);
      axios({
        method: "POST",
        url: "/api/users",
        data: newUser
      }).then(function() {
        return res.status(200).json(newUser);
      });
    });
  });

  app.post("/slack/commands/create/fc", (req, res) => {
    console.log(`
      Slack /create works
    `)
    console.log("req is: ")
    console.log(req.body)
    let { token, text, username, command, response_url, trigger_id, user_id, channel_name, channel_id} = req.body
    let env_token = process.env.BOT_ACCESS_TOKEN

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
      { headers: { Authorization: `Bearer ${env_token}` }
    }).then(res => {
      console.log(res.data)
      console.log(res.config)
      console.log(res.headers)
      //send this data back and grab a fortune
    })
})}
