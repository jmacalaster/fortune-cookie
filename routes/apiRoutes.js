var db = require("../models");
var wordFilter = require("../lib/wordfilter.js");
var slackbot = require("../lib/slackbot.js");
var mailer = require("../lib/email");

module.exports = function (app) {

  // ***************** USER ******************** //

  // Just lists user info without their fortunes
  app.get("/api/users", function (req, res) {
    db.User.findAll({}).then(function (data) {
      res.json(data);
    });
  });

  // One user and their fortunes (both sent and received)
  app.get("/api/users/:id", function (req, res) {
    db.User.findOne({
      where: {
        id: req.params.id
      },
      include: {
        all: true
      }
    }).then(function (data) {
      res.json(data);
    });
  });

  // One user and their sent fortunes
  app.get("/api/users/:id/sent", function (req, res) {
    db.User.findOne({
      where: {
        id: req.params.id
      },
      include: {
        model: db.Fortune,
        as: 'fromUser'
      }
    }).then(function (data) {
      res.json(data);
    });
  });

  // One user and their received fortunes
  app.get("/api/users/:id/received", function (req, res) {
    db.User.findOne({
      where: {
        id: req.params.id
      },
      include: {
        model: db.Fortune,
        as: 'toUser'
      }
    }).then(function (data) {
      res.json(data);
    });
  });

  // Create a new user
  // POST MUST INCLUDE:
  // name       the user's first name (maybe not needed?)
  // address    the email address or slack name or facebook name... 
  // platform   the platform through which we'll contact the user (email/slack/facebook?)
  app.post("/api/users", function (req, res) {
    db.User.create(req.body).then(function (data) {
      res.json(data);
    });
  });

  // ***************** FORTUNE ******************** //
  // Just lists fortune info without full user details
  app.get("/api/fortunes", function (req, res) {
    db.Fortune.findAll({}).then(function (data) {
      res.json(data);
    });
  });

  // One fortune and its users (both sent and received)
  app.get("/api/fortunes/:id", function (req, res) {
    db.Fortune.findOne({
      where: {
        id: req.params.id
      },
      include: {
        all: true
      }
    }).then(function (data) {
      res.json(data);
    });
  });

  // One fortune and the user who sent it
  app.get("/api/fortunes/:id/sent", function (req, res) {
    db.Fortune.findOne({
      where: {
        id: req.params.id
      },
      include: {
        model: db.User,
        as: 'fromUser'
      }
    }).then(function (data) {
      res.json(data);
    });
  });

  // One fortune and the user who received it
  app.get("/api/fortunes/:id/received", function (req, res) {
    db.Fortune.findOne({
      where: {
        id: req.params.id
      },
      include: {
        model: db.User,
        as: 'toUser'
      }
    }).then(function (data) {
      res.json(data);
    });
  });

  // Create a new fortune
  // POST BODY MUST INCLUDE:
  // text         the text of the fortune
  // fromUserId   the id of the user who sent the fortune
  app.post("/api/fortunes", function(req, res) {
    // Find a random user to send it to
    db.User.findOne({
      where: {
        id: {
          [db.Sequelize.Op.ne]: req.body.fromUserId
        },
        canReceive: true
      },
      order: [
        db.Sequelize.fn('RAND')
      ]
    }).then(function (randomUser) {
      // If no user is chosen, default to dummy user #1 (fortunes posted to the website)
      var recipientId = 1;
      if(randomUser){
        recipientId = randomUser.id;
      }
      // Filter the input for swear words! This is a family app!
      var cleanWord = wordFilter(req.body.text);
      db.Fortune.create({
        text: cleanWord,
        fromUserId: req.body.fromUserId,
        toUserId: recipientId
      }).then(function (data) {
        // Notify user based on platform
        if(recipientId!==1){
          if(randomUser.platform==="slack"){
            slackbot.postMessageToUser(randomUser.name, "You have a fortune waiting for you...\nType slash create to send someone else a fortune before you can read yours!")
          }
          else if (randomUser.plaform === "email") {
            // url to fortune for random user
            let url = "https://fortune-cookie-bot.herokuapp.com/fortunes/" + data.id;
            // message for random user
            let message = {
              from: '"Fortune Cookie 🥠" <fortunecookie.mailer@yahoo.com>',
              to: randomUser.address,
              subject: 'Your Fortune Awaits!',
              text: "Hi " + randomUser.name + ",  Go to the following link to view your fortune! " + url,
              html:
                '<p><b>Hi ' + randomUser.name + '!</b></p>' +
                '<p>Someone special has sent you a fortune! Click on the link below to view it! Thanks for using Fortune Cookie Bot!</p>' +
                '<p><a href="' + url + '"><b>View Fortune!</b></a></p>'
            };
            // send message to random user
            mailer.sendMail(message, (error, info) => {
              if (error) {
                console.log('Error sending email to ' + randomUser.name);
                console.log(error.message);
                return process.exit(1);
              }
              
              console.log('Email sent to ' + randomUser.name + '!');
              mailer.close();
            });
          }
        }
        // The user who sent the fortune can now receive a new one.
        db.User.update(
          {
            canReceive: true
          },
          {
            where: {
              id: req.body.fromUserId
            }
          });
        // The user who received it can no longer receive a new one.
        db.User.update(
          {
            canReceive: false
          },
          {
            where: {
              id: recipientId
            }
          });
        res.json(data);
      });
    });
  });

  app.put("/api/fortunes/:id/read", function(req, res) {
    db.Fortune.update(
      {
        isRead: true
      },
      {
        where: {
          id: req.params.id
        }
      }).then(function(data){
        res.json(data);
      })
  });

};
