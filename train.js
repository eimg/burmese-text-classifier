var fs = require('fs');
var nj = require('numjs');

var syllable = require("./syllable-breaker");
var training_data = require('./data.js');

// stop words - List of words (syllable) that are
// too common, noisy and less important
var ignore_words = require('./ignore');

console.log('------');
console.log(training_data.length + " sentences in training data");
console.log('------');

/* === Training Data Preparation === */

var words = [];
var classes = [];
var documents = [];

for(var i in training_data) {
    var pattern = training_data[i];

    var w = tokenize(pattern['sentence']);
    for(var ii in w) {
        words.push(w[ii]);
    }

    documents.push([w, pattern['class']]);

    if(!classes.includes(pattern['class'])) {
        classes.push(pattern['class']);
    }
}

// filter ignore words and duplicates
words = words.filter(function(w, i, self) {
    return !ignore_words.includes(w) && self.indexOf(w) === i;
});

// removing duplicates
classes = classes.filter(function(c, i, self) {
    return self.indexOf(c) === i;
});

console.log(documents.length + " documents");
console.log(classes.length + " classes");
// console.log(classes);
console.log(words.length + " unique words (syllables)");
// console.log(words);
console.log('------');

var training = [];
var output = [];
var output_empty = [];

for(var i in classes) {
    output_empty.push(0);
}

for(var i in documents) {
    var doc = documents[i];
    var bag = [];
    var pattern_words = doc[0];

    for(var ii in words) {
        if(pattern_words.includes(words[ii])) {
            bag.push(1);
        } else {
            bag.push(0);
        }
    }

    training.push(bag);

    var output_row = output_empty.slice(0);
    output_row[ classes.indexOf(doc[1]) ] = 1;
    output.push(output_row);
}

// console.log("# words " + words.length);
// console.log("# classes " + classes.length);
// var i = 0;
// var w = documents[i][0];
// console.log(w);
// console.log(training[i]);
// console.log(output[i]);

/* === Training Model === */
function train(X, y, hidden_neurons, alpha, epochs, dropout, dropout_percent) {
    var start_time = new Date();

    var X_arr = X.tolist();

    console.log("training with " + hidden_neurons + " neurons, alpha: " + alpha);
    console.log("input matrix: " + X_arr.length + "x" + X_arr[0].length);
    console.log("output matrix: 1x" + classes.length);
    console.log('------');

    var last_mean_error = 1;

    var synapse_0 = nj.array( rand(X_arr[0].length, hidden_neurons) );
    var synapse_1 = nj.array( rand(hidden_neurons, classes.length) );

    var prev_synapse_0_weight_update = nj.zeros(synapse_0.shape);
    var prev_synapse_1_weight_update = nj.zeros(synapse_1.shape);

    var synapse_0_direction_count = nj.zeros(synapse_0.shape);
    var synapse_1_direction_count = nj.zeros(synapse_1.shape);

    for(var j = 0; j < epochs + 1; j++) {

        var layer_0 = X;
        var layer_1 = nj.sigmoid(nj.dot(layer_0, synapse_0));

        if(dropout) {
            // I don't understand what this does yet
            // layer_1 *= nj.random.binomial([np.ones((len(X),hidden_neurons))], 1-dropout_percent)[0] * (1.0/(1-dropout_percent));
        }

        var layer_2 = nj.sigmoid(nj.dot(layer_1, synapse_1));
        var layer_2_error = y.subtract(layer_2);

        if( (j % 10000) == 0 && j > 5000 ) {
            // if this 10k iteration's error is greater than
            // the last iteration, break out
            if (nj.mean(nj.abs(layer_2_error)) < last_mean_error) {
                console.log("delta after " + j + " iterations:" + nj.mean(nj.abs(layer_2_error)) );
                last_mean_error = nj.mean(nj.abs(layer_2_error));
            } else {
                console.log ("break:" + nj.mean(nj.abs(layer_2_error)) + ">" + last_mean_error );
                break;
            }
        }

        var layer_2_delta = layer_2_error.multiply( curve(layer_2) );
        var layer_1_error = layer_2_delta.dot(synapse_1.T);
        var layer_1_delta = layer_1_error.multiply( curve(layer_1) );

        var synapse_1_weight_update = (layer_1.T.dot(layer_2_delta));
        var synapse_0_weight_update = (layer_0.T.dot(layer_1_delta));

        if(j > 0) {
            synapse_0_direction_count = synapse_0_direction_count.add(
                nj.abs(
                    binary_array(synapse_0_weight_update).subtract(
                        binary_array(prev_synapse_0_weight_update)
                    )
                )
            );

            synapse_1_direction_count = synapse_1_direction_count.add(
                nj.abs(
                    binary_array(synapse_1_weight_update).subtract(
                        binary_array(prev_synapse_1_weight_update)
                    )
                )
            );
        }

        synapse_1 = synapse_1.add( synapse_1_weight_update.multiply(alpha) );
        synapse_0 = synapse_0.add( synapse_0_weight_update.multiply(alpha) );

        prev_synapse_0_weight_update = synapse_0_weight_update;
        prev_synapse_1_weight_update = synapse_1_weight_update;
    }

    // Saving trained synapses to file
    var synapse_file = "synapses.json";
    var synapse = JSON.stringify({
        'synapse0': synapse_0.tolist(),
        'synapse1': synapse_1.tolist(),
        'words': words,
        'classes': classes
    }, null, 4);

    fs.writeFileSync(synapse_file, synapse, "utf8");
    console.log('------');
    console.log("saved synapses to:" + synapse_file);
    console.log('------');

    // Calculating trining time
    var end_time = new Date();
    var training_time = (end_time - start_time) / 1000;
    if(training_time > 60) {
        var min = Math.floor(training_time / 60);
        var sec = Math.floor(training_time % 60);
        console.log("completed in: " + min + " minutes " + sec + " seconds");
    } else {
        console.log("completed in: " + training_time + " seconds");
    }

    console.log('------');
}

/* === Math and Helper functions === */

// Break sentence to syllable and remove whitespaces
function tokenize(sentence) {
    var result = syllable(sentence).filter(function(item) {
        return !!item.trim();
    });

    return result;
}

// NumJs come with sigmoid function.
// But no sigmoid derivative. This is it.
function curve(nums) {
    nums = nums.tolist();
    var result = [];
    for(var i = 0; i < nums.length; i++) {
        result[i] = [];
        for(var ii=0; ii<nums[i].length; ii++) {
            result[i][ii] = nums[i][ii] * (1 - nums[i][ii]);
        }
    }

    return nj.array(result);
}

// Random number between 1 and -1
// return as 2D array
function rand(rows, cols) {
    var result = [];
    for(var i=0; i<rows; i++) {
        result[i] = [];
        for(var ii=0; ii<cols; ii++) {
            result[i][ii] = 2 * Math.random() - 1;
        }
    }

    return result;
}

// Return 2D array with 1 for positive and 0 for negative
function binary_array(matrix) {
    var arr = matrix.tolist();
    var nx = arr.length;
    var ny = arr[0].length;

    // Loop over all cells
    for (var i = 0; i < nx; ++i) {
        for (var j = 0; j < ny; ++j) {
            if( arr[i][j] > 0 ) {
                arr[i][j] = 1;
            } else {
                arr[i][j] = 0;
            }
        }
    }

    return nj.array(arr);
}

/* === Training === */
var X = nj.array(training);
var y = nj.array(output);

// X, y, hidden_neurons, alpha, epochs, dropout, dropout_percent
train(X, y, 20, 0.3, 100000, false, 0.2);
