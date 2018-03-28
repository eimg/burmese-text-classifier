var fs = require('fs');
var nj = require('numjs');

var syllable = require("./syllable-breaker");

var ERROR_THRESHOLD = 0.2;

/* === Loading Synapses === */
var synapse_file = "synapses.json";
var synapse = JSON.parse(fs.readFileSync(synapse_file, "utf8"));

var synapse_0 = nj.array(synapse.synapse0);
var synapse_1 = nj.array(synapse.synapse1);

var words = synapse.words;
var classes = synapse.classes;

/* === Helper Functions === */

// Break sentence to syllable and remove whitespaces
function tokenize(sentence) {
    var result = syllable(sentence).filter(function(item) {
        return !!item.trim();
    });

    return result;
}

// Building syllable matrix
function bow(sentence, words) {
    var sentence_words = tokenize(sentence);

    var bag = [];
    for(var i in words) {
        bag.push(0);
    }

    for(var i in sentence_words) {
        var s = sentence_words[i];

        for(var ii in words) {
            var w = words[ii];
            if(w == s) {
                bag[ii] = 1;
            }
        }
    }

    return nj.array(bag);
}

/* === classification === */
function think(sentence) {
    var x = bow(sentence, words);

    var l0 = x;
    var l1 = nj.sigmoid(nj.dot(l0, synapse_0));
    var l2 = nj.sigmoid(nj.dot(l1, synapse_1));

    return l2;
}

function classify(sentence) {
    var results = think(sentence);
    var results_array = results.tolist();

    // Only keeping the results that are above ERROR_THRESHOLD
    var trimmed_results = [];
    for(i in results_array) {
        if(results_array[i] > ERROR_THRESHOLD) {
            trimmed_results.push([i, results_array[i]]);
        }
    }

    // Sorting the results in descending order
    trimmed_results = trimmed_results.sort(function(a, b) {
        if (a[0] === b[0]) {
            return 0;
        } else {
            return (a[0] < b[0]) ? -1 : 1;
        }
    });

    var return_results = [];
    for(i in trimmed_results) {
        var r = trimmed_results[i];
        return_results.push( [ classes[ r[0] ], r[1] ] );
    }

    if(!return_results.length) {
        return_results.push( [ 'မသိပါ', '-1' ] );
    }

    console.log(sentence + " : " + return_results);
    return return_results;
}

/* === Classifying === */
classify("နေကောင်းရဲ့လား");
classify("ဒီကနေ့ဘယ်လိုလဲ");
classify("မနေ့ကကိစ္စစိတ်မဆိုးပါနဲ့");
classify("နားလည်ပေးတာကျေးဇူးတင်ပါတယ်");
classify("သွားလိုက်ဦးမယ်၊ နောက်မှတွေ့မယ်နော်");
