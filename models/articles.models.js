const db = require("../db/connection");

exports.fetchAllArticles = (sort_by = "created_at", order = "DESC", topic) => {
  const allowedSortBY = [
    "title",
    "author",
    "article_id",
    "topic",
    "votes",
    "comment_count",
    "created_at",
  ];
  const allowedTopics = [
    "coding",
    "football",
    "cooking",
    "mitch",
    "cats",
    "paper",
  ];
  const allowedOrder = ["ASC", "DESC"];

  if (!allowedOrder.includes(order) || !allowedSortBY.includes(sort_by)) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }

  let queryStr = `SELECT articles.*, COUNT(comment_id) AS comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id`;

  const topicValue = [];

  if (topic) {
    if (!allowedTopics.includes(topic)) {
      return Promise.reject({ status: 404, msg: "Not found" });
    } else {
      queryStr += ` WHERE topic = $1`;
      topicValue.push(topic);
    }
  }

  queryStr += ` GROUP BY articles.article_id`;

  const orderVariable = ` ORDER BY ${sort_by} ` + order + ";";

  queryStr += orderVariable;

  return db.query(queryStr, topicValue).then(reviews => {
    return reviews.rows;
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
