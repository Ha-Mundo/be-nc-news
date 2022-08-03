const express = require("express");
const app = express();
app.use(express.json());

const {
  psqlErrors,
  customErrors,
  handle404,
  handleFiveHundreds,
} = require("./errors/index.js");

const { getTopics } = require("./controllers/topics.controllers.js");
const {
  getArticleById,
  getVotes,
} = require("./controllers/articles.controllers.js");
const { getUsers } = require("./controllers/users.controllers.js");

app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticleById);
app.patch("/api/articles/:article_id", getVotes);

app.get("/api/users", getUsers);

app.all("*", (req, res) => {
  res.status(404).send({ msg: "Path not found" });
});

app.use(psqlErrors);
app.use(customErrors);
app.use(handle404);
app.use(handleFiveHundreds);

module.exports = app;
