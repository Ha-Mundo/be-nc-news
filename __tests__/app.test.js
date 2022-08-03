const db = require("../db/connection");
const testData = require("../db/data/test-data/index.js");
const seed = require("../db/seeds/seed.js");
const app = require("../app");
const request = require("supertest");

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
