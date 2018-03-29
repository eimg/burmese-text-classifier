var data = require("../data");
var _ = require("lodash");
var fs = require("fs");


var wstream = fs.createWriteStream("../data_sorted.js");
var groups = _.groupBy(data, "class");

wstream.write("module.exports = [\n");
var sortedKeys = Object.keys(groups).sort();

sortedKeys.forEach(function(key) {
    var classLabel = groups[key];
    classLabel = _.orderBy(classLabel, ["sentence", "asc"]);

    classLabel.forEach(function (e) {
        // wstream.write("\t");
        wstream.write(JSON.stringify(e, null, 4));
        wstream.write(",");
    });
});
wstream.write("];");
wstream.end();