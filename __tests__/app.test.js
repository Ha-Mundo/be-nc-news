const db = require("../db/connection");
const testData = require("../db/data/test-data/index.js");
const seed = require("../db/seeds/seed.js");
const app = require("../app");
const request = require("supertest");
require("jest-sorted");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("GET /api/topics", () => {
  test("Returns an array of all the topics with description and slug properties", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(res => {
        const topics = res.body.topics;
        expect(topics).toBeInstanceOf(Array);
        expect(topics.length).toBe(3);
        topics.forEach(topic => {
          expect(topic).toEqual(
            expect.objectContaining({
              description: expect.any(String),
              slug: expect.any(String),
            })
          );
        });
      });
  });
});

describe("GET/api/articles/:article_id", () => {
  test("Status:200 and responds with an article object by requested id ", () => {
    const articleId = 1;
    return request(app)
      .get(`/api/articles/${articleId}`)
      .expect(200)
      .then(response => {
        expect(typeof response.body.article).toBe("object");
        expect(response.body.article).toEqual(
          expect.objectContaining({
            article_id: articleId,
            title: "Living in the shadow of a great man",
            body: "I find this existence challenging",
            votes: 100,
            topic: "mitch",
            author: "butter_bridge",
            created_at: "2020-07-09T20:11:00.000Z",
          })
        );
      });
  });
  test('Status:400 returns "bad request"', () => {
    return request(app)
      .get("/api/articles/abc")
      .expect(400)
      .then(response => {
        expect(response.body.msg).toBe("bad request");
      });
  });
  test('Status:404 and returns "Article not found"', () => {
    return request(app)
      .get("/api/articles/99999")
      .expect(404)
      .then(response => {
        expect(response.body.msg).toEqual("Article not found");
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("PATCH: should increment vote for the given article id", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: 5 })
      .expect(200)
      .then(res => {
        expect(typeof res.body.article).toBe("object");
        expect(res.body.article).toEqual({
          article_id: 1,
          title: "Living in the shadow of a great man",
          body: "I find this existence challenging",
          votes: 105,
          topic: "mitch",
          author: "butter_bridge",
          created_at: "2020-07-09T20:11:00.000Z",
        });
      });
  });
  test("PATCH: should decrement vote for the given article id", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: -5 })
      .expect(200)
      .then(res => {
        expect(typeof res.body.article).toBe("object");
        expect(res.body.article).toEqual({
          article_id: 1,
          title: "Living in the shadow of a great man",
          body: "I find this existence challenging",
          votes: 95,
          topic: "mitch",
          author: "butter_bridge",
          created_at: "2020-07-09T20:11:00.000Z",
        });
      });
  });

  test('Status:400 returns "bad request"', () => {
    return request(app)
      .patch("/api/articles/abcd")
      .send({ inc_votes: 5 })
      .expect(400)
      .then(response => {
        expect(response.body.msg).toBe("bad request");
      });
  });

  test("status: 404 for valid but non existent article_id", () => {
    return request(app)
      .patch("/api/articles/77777")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("article_id not found");
      });
  });

  test("status: 400 for invalid inc_votes value", () => {
    const input = { inc_votes: "cat" };
    return request(app)
      .patch("/api/articles/1")
      .send(input)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });

  test("status: 400 for invalid inc_votes key such as inc_vote", () => {
    const input = { inc_vote: "cat" };
    return request(app)
      .patch("/api/articles/1")
      .send(input)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
});

describe("GET /api/users", () => {
  test("Responds with status: 200 and an array of objects containing the correct keys", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body.users)).toBe(true);
        expect(body.users.length).toBe(4);
        body.users.forEach(user => {
          expect(user.username).toEqual(expect.any(String));
          expect(user.name).toEqual(expect.any(String));
          expect(user.avatar_url).toEqual(expect.any(String));
        });
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("200: should respond with an object with comment_count property", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(res => {
        expect(res.body.article).toEqual(
          expect.objectContaining({
            article_id: expect.any(Number),
            author: expect.any(String),
            title: expect.any(String),
            body: expect.any(String),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            comment_count: expect.any(String),
          })
        );
        expect(res.body.article.comment_count).toBe("11");
      });
  });
  test("Status: 400, responds with invalid ", () => {
    return request(app)
      .get("/api/articles/APPLE")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
  test("Status: 404, responds with id error that doesn't exist ", () => {
    return request(app)
      .get("/api/articles/77777777")
      .expect(404)
      .then(res => {
        expect(res.body.msg).toBe("Article not found");
      });
  });
});

describe("GET /api/articles", () => {
  test("Responds with an array of user objects with the author, title, article_id, topic, created_at, votes and comment_count properties, sorted by date in descending order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles.length).toBe(12);
        articles.forEach(article => {
          expect(article).toMatchObject({
            article_id: expect.any(Number),
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            comment_count: expect.any(String),
          });
        });
        expect(articles).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("Status 200: should accept sort_by query", () => {
    return request(app)
      .get("/api/articles?sort_by=author")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("author", { descending: true });
      });
  });
  test("Status: 400 for invalid sort_by value", () => {
    return request(app)
      .get("/api/articles?sort_by=p34ch")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  test("Status: 200 can change the order to ASC/DESC", () => {
    return request(app)
      .get("/api/articles?order=ASC")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("created_at");
      });
  });
  test("Status: 400 for invalid order value", () => {
    return request(app)
      .get("/api/articles?order=p34ch")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  test("Status: 200 can refine by topic", () => {
    return request(app)
      .get("/api/articles?topic=cats")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toHaveLength(1);
        body.articles.forEach(article => {
          expect(article.topic).toBe("cats");
        });
      });
  });
  test("Status: 404 for topic not found", () => {
    return request(app)
      .get("/api/articles?topic=p34ch")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
  });
  test("Responds with status: 200 and an empty array for valid and existent topic but no data", () => {
    return request(app)
      .get("/api/articles?topic=paper")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toHaveLength(0);
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("Comment request responds with a comments array", () => {
    return request(app)
      .get("/api/articles/9/comments")
      .expect(200)
      .then(res => {
        expect(res.body.comments).toBeInstanceOf(Array);
        expect(res.body.comments).toHaveLength(2);
        res.body.comments.forEach(comment => {
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            author: expect.any(String),
            article_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            body: expect.any(String),
          });
        });
      });
  });
  test("Return 400 and Bad Request if trying to get comments of invalid article id", () => {
    return request(app)
      .get("/api/articles/notanid/comments")
      .expect(400)
      .then(res => {
        expect(res.body.msg).toBe("bad request");
      });
  });
  test("Responds with 404 when given article_id is not present", () => {
    return request(app)
      .get("/api/articles/777/comments")
      .expect(404)
      .then(res => {
        expect(res.body.msg).toEqual("article_id not found");
      });
  });
  test("Responds with 200 and an empty array when given a valid article id that has no comments", () => {
    return request(app)
      .get("/api/articles/4/comments")
      .expect(200)
      .then(res => {
        const { comments } = res.body;
        expect(Array.isArray(comments)).toBe(true);
        expect(comments).toHaveLength(0);
      });
  });
});

describe("Add a comment", () => {
  test("Post an object with username and body properties, adds comment based on comment id", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({ username: "butter_bridge", body: "Za Worldo!" })
      .expect(201);
  });
  test("Status: 400 for invalid article_id", () => {
    return request(app)
      .post("/api/articles/p34ch/comments")
      .send({ username: "butter_bridge", body: "Za Worldo!" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
  test("Status: 404 for valid but non existent article_id", () => {
    return request(app)
      .post("/api/articles/7777/comments")
      .send({ username: "butter_bridge", body: "Za Worldo!" })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
  });
  test("Status: 400 for invalid input key", () => {
    const input = {
      usernam: "butter_bridge",
      body: "Muda muda muda!",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(input)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
  test("Status: 400 for invalid input key", () => {
    const input = {
      username: "butter_bridge",
      b0d1: "Muda muda muda!",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(input)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
  test("Status: 404 for user not found", () => {
    const input = {
      username: "th3-w0rld",
      body: "Muda muda muda!",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(input)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
  });
});
