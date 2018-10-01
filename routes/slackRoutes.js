var axios = require("axios");
var db = require("../models");

var env_token = process.env.BOT_ACCESS_TOKEN

module.exports = function(app) {
  app.post("/slack/actions/submit", (req, res)=> {
    var payload = JSON.parse(req.body.payload)
    var text = payload.submission.newFortune;
    var user = payload.user.id;
    db.User.findOne({
      where: {
        address: user
      }
    }).then(function(data){
      if (data){
        db.User.findOne({
          where: {
            id: {
              [db.Sequelize.Op.ne]: data.id
            }//,
            // TURNED OFF FOR TESTING: 
            // In final production, we will want to choose a random user who hasn't been pinged in at least 18 hours (or so)
            // updatedAt: {
            //   [db.Sequelize.Op.lt]: new Date() - 18 * 60 * 60 * 1000
            // }
          },
          order: [
            db.Sequelize.fn('RAND')
          ]
        }).then(function(randomUser) {
          db.Fortune.create({
            text: text,
            fromUserId: data.id,
            toUserId: randomUser.id
          }).then(function(dbFortune){
            return res.status(200).json({
              "response_type": "in_channel",
              "text": "Your fortune is created!"
            });
          });
        });
      }
      else{
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
    }).then(function(data) {
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

  app.post("/slack/commands/create/fc", (req, res) => {
    console.log(`
      Slack /create works
    `)
    console.log("req is: ")
    console.log(req.body)
    let { token, text, username, command, response_url, trigger_id, user_id, channel_name, channel_id} = req.body

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
