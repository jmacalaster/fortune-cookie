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
    }).then(function(data){
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
    }).then(function(data){
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
    }).then(function(data){
      res.json(data);
    });
  });

  // Create a new fortune
  app.post("/api/fortunes", function (req, res) {
    db.Fortune.create(req.body).then(function (data) {
      res.json(data);
    });
  });

};
