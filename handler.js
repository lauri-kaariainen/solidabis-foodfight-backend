const serverless = require("serverless-http");
const express = require("express");
const app = express();
const cors = require('cors');
const rawDATA = require("./foodsUTF8.json");

const DATA = rawDATA.map(datum => (
  {
    ...datum,
    Valuelist: datum.Valuelist.split(",").map(str => parseFloat(str)),
  })
)

app.use(cors({
  "origin": "*",
}));


app.get("/", (req, res, next) => {
  return res.status(200).json({
    message: "use /id, /name, /id/num, /name/name",
  });
});

app.get("/id", (req, res, next) => {
  return res.status(200).json(
    DATA.map(item => item.food_id)
  );
});

app.get("/name", (req, res, next) => {
  return res.status(200).json(
    DATA.map(item => item.name)
  );
});


app.get("/id/:id", (req, res, next) => {
  if (!isNaN(parseInt(req.params.id)) && parseInt(req.params.id) >= 0) {
    return res.status(200).json(DATA.filter(item => item.food_id === parseInt(req.params.id)));
  } else
    return res.status(400).json(null)
});



app.get("/name/:name", (req, res, next) => {
  if (req.params.name && req.params.name.length > 0) {
    return res.status(200).json(
      DATA.filter(
        item =>
          item.name
            .toLowerCase()
            .search(req.params.name.toLowerCase()) !== -1));
  } else
    return res.status(400).json(null)
});


app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});

module.exports.handler = serverless(app);
