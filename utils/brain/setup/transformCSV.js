const fs = require("fs");

var text_classes = {
  toxic: 0,
  severe_toxic: 1,
  obscene: 2,
  threat: 3,
  insult: 4,
  identity_hate: 5,
};

fs.readFile("./train.csv", "utf-8", (err, res) => {
  let rows = res.split("-+=+-");

  // ((,\d){6})
  console.log(rows.length);
  console.log(rows[0].split());

  rows = rows.map((row) => {
    // get the array of bools for classes
    if (!row.match(/((,\d){6})/)) {
      return {};
    }
    const classifications = row
      .match(/((,\d){6})/)[1]
      .replace(",", "")
      .split(",")
      .map((num) => parseInt(num, 10));

    let outputMap = text_classes;
    Object.keys(text_classes).forEach((classification, i) => {
      outputMap[classification] = classifications[i];
    });

    return {
      input: row.replace(/((,\d){6})/, ""),
      ouput: outputMap,
    };
  });

  fs.writeFile(
    "formattedTraining.json",
    JSON.stringify(rows, null, 2),
    (err) => {
      if (err) {
        console.error(err);
        return;
      }

      console.log("done");
    }
  );
});
