const express = require("express");
const app = express();
app.use(express.json());

const { getTopics } = require("./controllers/topics.controllers.js");

const {
  getAllArticles,
  getArticleById,
  getVotes,
} = require("./controllers/articles.controllers.js");

const { getUsers } = require("./controllers/users.controllers.js");

const {
  getComment,
  postComment,
  removeComment,
} = require("./controllers/comments.controllers");

const {
  psqlErrors,
  customErrors,
  handle404,
  handleFiveHundreds,
} = require("./errors/index.js");

// Topics
app.get("/api/topics", getTopics);

// Articles
app.get("/api/articles", getAllArticles);
app.get("/api/articles/:article_id", getArticleById);
app.patch("/api/articles/:article_id", getVotes);

// Users
app.get("/api/users", getUsers);

// Comments
app.get("/api/articles/:article_id/comments", getComment);
app.post("/api/articles/:article_id/comments", postComment);
app.delete("/api/comments/:comment_id", removeComment);

// Error handling
app.all("*", (req, res) => {
  res.status(404).send({ msg: "Path not found" });
});

app.use(psqlErrors);
app.use(customErrors);
app.use(handle404);
app.use(handleFiveHundreds);

module.exports = app;
