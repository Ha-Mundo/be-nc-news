const db = require("../db/connection");

exports.selectArticleById = article_id => {
  return db
    .query(
      "SELECT articles.*, COUNT(comments.body) AS comment_count FROM articles JOIN comments ON comments.article_id = articles.article_id WHERE articles.article_id = $1 GROUP BY articles.article_id;",
      [article_id]
    )
    .then(result => {
      if (result.rows.length) {
        return result.rows[0];
      } else {
        return Promise.reject({ status: 404, msg: "Article not found" });
      }
    });
};

exports.updateVotes = (body, article_id) => {
  const { inc_votes } = body;
  return db
    .query(
      `UPDATE articles
   SET votes=votes+$1
  WHERE article_id=$2
   RETURNING *;`,
      [inc_votes, article_id]
    )
    .then(response => {
      if (response.rowCount === 0) {
        return Promise.reject({
          status: 404,
          msg: "article_id not found",
        });
      }
      return response.rows[0];
    });
};
