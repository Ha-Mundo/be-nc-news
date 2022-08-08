const db = require("../db/connection");

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

exports.addComment = (addComment, article_id) => {
  const { username, body } = addComment;

  return db
    .query(
      `
    INSERT INTO comments (author, body, article_id) 
    VALUES ($1, $2, $3)
    RETURNING *;
    `,
      [username, body, article_id]
    )
    .then(result => {
      return result.rows;
    });
};

exports.deleteComment = id => {
  return db
    .query("DELETE FROM comments WHERE comment_id = $1 RETURNING *;", [id])
    .then(response => {
      if (response.rowCount === 0) {
        return Promise.reject({
          status: 404,
          msg: "not found",
        });
      }
    });
};
