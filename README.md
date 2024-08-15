# Northcoders News API

### Introduction

The purpose of this API is to programmatically access application data, with the intention of providing this information to inform front end development. This API project mimicks the building of a real world backend service, and the created database is stored and managed using PSQL.

### API

You may access the API here: **https://be-nc-news.glitch.me/api**

### Endpoints

```http
GET /api

GET /api/topics

GET /api/articles

GET /api/articles/:article_id

PATCH /api/articles/:article_id

GET /api/users

GET /api/articles/:article_id/comments

POST /api/articles/:article_id/comments

DELETE /api/comments/:comment_id
```

### Requirements

- Node minimum v12, recommended v14, current v16.14.2
- PostgreSQL v14.1
- Any API client, recommended: [Insomnia](https://insomnia.rest/download)

## Step 1 - Clone the forked repository

On the command line, navigate to the folder you want this repository to be store and enter the code below:

```
git clone https://github.com/Ha-Mundo/be-nc-news.git
```

## Step 2 - Install dependencies

Once you have created a local copy of this repository, you will need to install the required dependencies with the following commands:

```
npm install -D jest
npm install -D jest-sorted
npm install -D supertest
npm install pg
npm install pg-format
npm install express
npm install dotenv
npm install nodemon
```

Or install all the required dependencies with the single command:

```
npm install
```

## Step 3 - Create Environment Variables Files

In order to connect to different PostgreSQL databases, you will need to create two environment variable files in the root folder. Dotenv will be using these .env files to connect you to the right database.

```
.env.test
.env.development
```

You will find an `.env-example` file in this repo, which contains the format you want to insert into these two .env files.
Make sure your .env files contain their respective database names and double check that these .env files are .gitignored.

## Step 4 - Set up and seed databases

Database seeding is the initial process of populating a database with data. This data can be dummy data for testing or real one.

Before all that, we need to set up(create) the required databases first.

```
npm run setup-dbs
```

Then, we insert data in the database(seeding)

```
npm run seed
```

To instructs a local port to start listening for requests

```
npm run start
```

## Step 5 - Run Test

These tests are designed to ensure endpoints and errors are working as they should.
The API test files are already set in the test environment so you can run your test from the `__test__` folder.

```
npm test app.test
```

To stop the script, click anywhere in your terminal and press `CTRL+C` (for Windows and Mac).

## Step 6 - Make CRUD Requests

To make requests, open your preferred API client and make the requests there.

- GET requests for users, topics, articles and their comments
- GET requests for articles by an identifier
- PATCH requests to add or remove votes
- POST new comments
- DELETE comments
- Articles can be filtered by topic and sorted in specified orders

Please refer to **https://be-nc-news.glitch.me/api** API for the request methods and paths available.
