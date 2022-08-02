const express = require("express");
const { psqlErrors, customErrors, handle404 } = require("./errors/index.js");
const { getTopics } = require("./controllers/topics.controllers.js");
const { getArticleById } = require("./controllers/articles.controllers.js");
const app = express();
app.use(express.json());

app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticleById);

app.all("*", (req, res) => {
  res.status(404).send({ msg: "Path not found" });
});

app.use(psqlErrors);
app.use(customErrors);
app.use(handle404);

module.exports = app;
