const express = require("express");
const { psqlErrors, customErrors, handle500s } = require("./errors/index");
const { getTopics } = require("./controllers/topics.controllers.js");
const app = express();
app.use(express.json());

app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticleById);

app.all("*", (req, res) => {
  res.status(404).send({ msg: "Path not found" });
});

app.use(psqlErrors);
app.use(customErrors);

module.exports = app;
