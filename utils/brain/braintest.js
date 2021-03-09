const mimir = require("mimir");
const brain = require("brain.js");
const fs = require("fs").promises;

/* few utils for the example */
function vec_result(res, num_classes) {
  var i = 0,
    vec = [];
  for (i; i < num_classes; i += 1) {
    vec.push(0);
  }
  vec[res] = 1;
  return vec;
}

function maxarg(array) {
  return array.indexOf(Math.max.apply(Math, array));
}

// train data
var text_classes = {
  safe: 0,
  bad: 1,
};

const classes_array = Object.keys(text_classes);

async function getTrainingData() {
  const trainingData = JSON.parse(
    await fs.readFile("./training.json", "utf-8")
  );

  const texts = trainingData.map((obj) => obj.input);

  const dict = mimir.dict(texts);
  return { dict, trainingData };
}

async function main() {
  const { trainingData, dict } = await getTrainingData();

  const traindata = trainingData.map((obj) => [
    mimir.bow(obj.input, dict),
    text_classes[obj.output],
  ]);

  var net = new brain.NeuralNetwork();

  var finalTrainingData = traindata.map(function (pair) {
    return {
      input: pair[0],
      output: vec_result(pair[1], classes_array.length),
    };
  });

  net.train(finalTrainingData);
  let res = net.toJSON();
  console.log(res);
  fs.writeFile("brain-data.json", JSON.stringify(res));
}

// main();

async function hydrate() {
  var net = new brain.NeuralNetwork();
  let data = JSON.parse(await fs.readFile("brain-data.json", "utf-8"));
  net.fromJSON(data);

  const { dict } = await getTrainingData();

  let test = mimir.bow("hey there you're a dick sometimes", dict);

  var predict = net.run(test);
  console.log(predict);
  console.log(classes_array[maxarg(predict)], predict[maxarg(predict)]);
}

hydrate();

// const fetch = require("node-fetch");

// fetch("https://a.4cdn.org/b/1.json")
//   .then((res) => res.json())
//   .then((data) => {
//     // console.log(JSON.stringify(data, null, 2));

//     let posts = data.threads
//       .map((thread) => thread.posts)
//       .flat()
//       .map((p) => removeHTML(p.com))
//       .map((p) => ({ input: p, output: "bad" }));

//     console.log(JSON.stringify(posts, null, 2));
//   });

// function removeHTML(string) {
//   if (!string) {
//     return "";
//   }

//   return string
//     .replace(/<br><br>/g, "\n")
//     .replace(/(<([^>]+)>)|\d|&.{2,4};/gi, "");
// }
