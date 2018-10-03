var express = require("express");
var bodyParser = require("body-parser");
require("dotenv").config();

var PORT = process.env.PORT || 8080;

var app = express();

app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

//Slackbots Dependency.
//var Slackbots = require("./lib/slackbot.js");
//console.log(Slackbots);

require("./routes/apiRoutes")(app);
require("./routes/htmlRoutes")(app);
require("./routes/slackRoutes")(app);

var db = require("./models");

var syncOptions = { force: false };

if (process.env.NODE_ENV === "test") {
  syncOptions.force = true;
}

db.sequelize.sync(syncOptions).then(function() {
  db.User.create({
    name: "site",
    address: "cookie",
    platform: "web"
  }).then(function() {
    db.Fortune.bulkCreate([
      {
        text: "Fortune Not Found: Abort, Retry, Ignore?",
        fromUserId: 1,
        toUserId: 1
      },
      {
        text: "About time I got out of that cookie",
        fromUserId: 1,
        toUserId: 1
      },
      {
        text:
          "The early bird gets the worm, but the second mouse gets the cheese",
        fromUserId: 1,
        toUserId: 1
      },
      {
        text:
          "Be on alert to recognize your prime at whatever time of your life it may occur",
        fromUserId: 1,
        toUserId: 1
      },
      {
        text: "Your road to glory will be rocky, but fulfilling",
        fromUserId: 1,
        toUserId: 1
      },
      {
        text:
          "Courage is not simply one of the virtues, but the form of every virtue at the testing point",
        fromUserId: 1,
        toUserId: 1
      }
    ]).then(function() {
      app.listen(PORT, function() {
        console.log("listening on port " + PORT);
      });
    });
  });
});

module.exports = app;
