# Burmese Text Classifier

A neural network based text classification system for Burmese. Implemented in JavaScript. See [hello-nn-js](https://github.com/eimg/hello-nn-js) for the techniques used in this system.

## Usage
* Edit `data.js` and `ignore.js` with your training data
* Run `train.js` to train

```JavaScript
$ node train.js
// ------
// 92 sentences in training data
// ------
// 92 documents
// 12 classes
// 124 unique words
// ------
// training with 20 neurons, alpha: 0.1
// input matrix: 92x124
// output matrix: 1x12
// ------
// delta after 10000 iterations:0.002545468273469531
// delta after 20000 iterations:0.0017300341895297772
// delta after 30000 iterations:0.0013860167538267646
// delta after 40000 iterations:0.0011858891220595713
// delta after 50000 iterations:0.001051459703515515
// delta after 60000 iterations:0.0009533639577651252
// delta after 70000 iterations:0.0008778035696994181
// delta after 80000 iterations:0.000817337497039643
// delta after 90000 iterations:0.0007675568174097644
// delta after 100000 iterations:0.0007256632173564647
// ------
// saved synapses to:synapses.json
------
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
