const db = require("../db/connection");

exports.fetchAllArticles = () => {
  return db
    .query(
      "SELECT articles.*, COUNT (comments.article_id) :: INTEGER AS comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id  GROUP BY articles.article_id ORDER BY created_at DESC"
    )
    .then(({ rows }) => {
      return rows;
    });
};

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

exports.fetchComment = article_id => {
  return db
    .query(
      `
  SELECT *
  FROM articles
  WHERE article_id=$1;
  `,
      [article_id]
    )
    .then(res => {
      if (res.rowCount === 0) {
        return Promise.reject({
          status: 404,
          msg: "article_id not found",
        });
      } else {
        return db
          .query(`SELECT * FROM comments WHERE article_id = $1;`, [article_id])
          .then(res => {
            return res.rows;
          });
      }
    });
};
