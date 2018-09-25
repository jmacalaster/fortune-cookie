var db = require("../models");

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
    }).then(function(data){
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
    }).then(function(data){
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
    }).then(function(data){
      res.json(data);
    });
  });

  // Create a new user
  app.post("/api/users", function (req, res) {
    db.User.create(req.body).then(function (data) {
      res.json(data);
    });
  });

};
