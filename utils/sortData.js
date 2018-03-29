var data = require("../data");
var _ = require("lodash");
var fs = require("fs");


var wstream = fs.createWriteStream("../data2.js");
var groups = _.groupBy(data, "class");

wstream.write("module.exports = [\n");
Object.keys(groups).forEach(function(key) {
    var classLabel = groups[key];
    classLabel = _.orderBy(classLabel, ["sentence", "asc"]);

    classLabel.forEach(function (e) {
        wstream.write("\t");
        wstream.write(JSON.stringify(e));
        wstream.write(",\n");
    });
    wstream.write("\n");
});

wstream.write("]");
wstream.end();