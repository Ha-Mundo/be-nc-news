const {
  fetchComment,
  addComment,
  deleteComment,
} = require("../models/comments.models");

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

  addComment(req.body, article_id)
    .then(comment => {
      res.status(201).send({ comment });
    })
    .catch(err => {
      next(err);
    });
};

exports.removeComment = (req, res, next) => {
  const id = req.params.comment_id;
  deleteComment(id)
    .then(() => {
      res.status(204).send();
    })
    .catch(next);
};
