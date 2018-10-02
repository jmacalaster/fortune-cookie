var Filter = require("bad-words");

filter = new Filter({ placeHolder: "🥠" });

wordFilter = function(text) {
  filter.clean(text);
  return filter.clean(text);
};

module.exports = wordFilter;
