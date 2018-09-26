var db = require("../models");

module.exports = function(app) {
  // Load index page
  app.get("/", function(req, res) {
    db.Fortune.findOne({
      order: [db.Sequelize.fn("RAND")]
    }).then(function(data) {
      res.render("index", {
        text: data.text
      });
    });
  });

  // Load one specific fortune (can add a different template later if needed)
  app.get("/fortunes/:id", function(req, res) {
    db.Fortune.findOne({ where: { id: req.params.id } }).then(function(data) {
      if (data.isRead) {
        res.render("index", {
          text: data.text
        });
      }
      else {
        res.render("newFortune", { id: req.params.id, user: data.toUserId });
      }
    });
  });

  // Render 404 page for any unmatched routes
  app.get("*", function(req, res) {
    res.render("404");
  });
};
