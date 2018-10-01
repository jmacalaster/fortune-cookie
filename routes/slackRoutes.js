var axios = require("axios");
var db = require("../models");

module.exports = function(app) {
  app.post("/slack/commands/signup", function(req, res) {
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
      axios({
        method: "POST",
        url: "/api/users",
        data: newUser
      }).then(function() {
        res.json(newUser);
      });
    });
  });
};
