var db = require("../models");

module.exports = function(app) {
  // Load index page with random fortune sent to dummy user
  app.get("/", function(req, res) {
    db.Fortune.findOne({
      where: {
        toUserId: 1
      },
      order: [db.Sequelize.fn("RAND")]
    }).then(function(data) {
      if (!data) {
        res.render("index", {
          text: "This is not the fortune you are looking for.",
          user: 0
        });
      }
      else {
        res.render("index", {
          text: data.text,
          user: data.toUserId
        });
      }
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
        res.render("newFortune", {
          id: req.params.id,
          user: data.toUserId
        });
      }
    });
  });

  // Render 404 page for any unmatched routes
  app.get("*", function(req, res) {
    res.render("index", {
      text: "Error 404: Your fortune cannot be found."
    });
  });
};
