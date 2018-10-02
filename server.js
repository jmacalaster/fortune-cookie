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
var Slackbots = require("./lib/slackbot.js");
console.log(Slackbots);

require("./routes/apiRoutes")(app);
require("./routes/htmlRoutes")(app);
require("./routes/slackRoutes")(app);

var db = require("./models");

var syncOptions = { force: false };

if (process.env.NODE_ENV === "test") {
  syncOptions.force = true;
}

db.sequelize.sync(syncOptions).then(function() {
  app.listen(PORT, function() {
    console.log("listening on port " + PORT);
  });
});

module.exports = app;
