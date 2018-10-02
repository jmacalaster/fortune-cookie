var Filter = require("bad-words");

filter = new Filter({ placeHolder: "*" }); //🥠" });

wordFilter = function(text) {
  filter.clean(text);
  console.log(filter.clean(text));
};

return wordFilter;
