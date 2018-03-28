# Burmese Text Classifier

A neural network based text classification system for Burmese. Implemented in JavaScript. See [Hello NN JS](https://github.com/eimg/hello-nn-js) for the techniques used in this system.

## Usage
* Edit `data.js` and `ignore.js` with your training data
* Run `train.js` to train

```JavaScript
$ node train.js
// ------
// 41 sentences in training data
// ------
// 41 documents
// 7 classes
// 65 unique words
// ------
// training with 20 neurons, alpha: 0.1
// input matrix: 41x65
// output matrix: 1x7
// ------
// delta after 10000 iterations:0.004234055568715264
// delta after 20000 iterations:0.00289157388123366
// delta after 30000 iterations:0.002320731283442854
// delta after 40000 iterations:0.001987644774146095
// delta after 50000 iterations:0.001763531752997483
// delta after 60000 iterations:0.0015998154796089737
// delta after 70000 iterations:0.001473611983173432
// delta after 80000 iterations:0.00137255990945845
// delta after 90000 iterations:0.001289326195310199
// delta after 100000 iterations:0.0012192523713774868
// ------
// saved synapses to:synapses.json
// ------
```

* Use `classify()` Function from `classify.js`

```JavaScript
classify("နေကောင်းရဲ့လား");
// မိတ်ဆက်စကား,0.9977236760486335

classify("ဒီကနေ့ဘယ်လိုလဲ");
// မေးခွန်း,0.99701083408771

classify("မနေ့ကကိစ္စစိတ်မဆိုးပါနဲ့");
// တောင်းပန်စကား,0.9992552350914881

classify("နားလည်ပေးတာကျေးဇူးတင်ပါတယ်");
// ကျေးဇူးစကား,0.9457339301703951

classify("သွားလိုက်ဦးမယ်၊ နောက်မှတွေ့မယ်နော်");
// နှုတ်ဆက်စကား,0.9991549287925998
```

## Todo
* Add sentence segmentation
* Extract subject, object and action in sentence
* Highlight classified words

## Credit
* [Text Classification using Neural Networks](https://machinelearnings.co/text-classification-using-neural-networks-f5cd7b8765c6)
