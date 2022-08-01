const express = require("express");
const { psqlErrors, customErrors, handle500s } = require("./errors/index");
const { getTopics } = require("./controllers/topics.controllers.js");
const app = express();
app.use(express.json());

app.get("/api/topics", getTopics);

app.all("*", (req, res) => {
  res.status(404).send({ msg: "Path not found" });
});

app.use(psqlErrors);
app.use(customErrors);
app.use(handle500s);
module.exports = app;
