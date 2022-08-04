const {
  fetchAllArticles,
  selectArticleById,
  updateVotes,
  fetchComment,
  addComment,
} = require("../models/articles.models");

exports.getAllArticles = (req, res, next) => {
  fetchAllArticles()
    .then(articles => {
      res.send({ articles });
    })
    .catch(err => {
      next(err);
    });
};

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  selectArticleById(article_id)
    .then(article => {
      res.status(200).send({ article });
    })
    .catch(err => {
      next(err);
    });
};

exports.getVotes = (req, res, next) => {
  const { article_id } = req.params;
  updateVotes(req.body, article_id)
    .then(article => {
      res.status(200).send({ article });
    })
    .catch(err => {
      next(err);
    });
};

exports.getComment = (req, res, next) => {
  const { article_id } = req.params;
  fetchComment(article_id)
    .then(comments => {
      res.status(200).send({ comments });
    })
    .catch(err => {
      next(err);
    });
};

exports.postComment = (req, res, next) => {
  const { article_id } = req.params;

  addComment(req.body, article_id).then(comment => {
    res.status(201).send({ comment });
  });
};
