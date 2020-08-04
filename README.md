# Lyrix
Lyrix is a song collection app which helps you keep track of the songs you like to play or sing, along with your own notes, lyrics, or chords. It consists of a **Node.js** server and a **React** client:
* In *development*, the **client** is accessed via the web. It proxies external URLs to the **server**.
* In *production*, the **server** is accessed via the web. It routes clients to a static build of the React **client**.

[![Build Status](https://travis-ci.org/bluepostit/lyrix.svg?branch=master)](https://travis-ci.org/bluepostit/lyrix)

**Server technologies:**
- The server is a REST API service written in [Node.js](https://nodejs.org/en/).
- It's built and run with the [Yarn](https://yarnpkg.com/lang/en/) package manager.
- It uses [Express](https://expressjs.com/) to structure its request-response system and for routing.
- Database access is via [Ojection.js ORM](https://vincit.github.io/objection.js/) on top of [Knex.js query builder](https://knexjs.org/).
- Database implementation is [PostgreSQL database](https://www.postgresql.org/)
- For sessions, it uses [Redis](https://redis.io/) and [connect-redis](https://github.com/tj/connect-redis)
- For authentication, it uses [Passport](http://www.passportjs.org/).

**Server testing:**
- Good coverage of both system and unit testing with the [Mocha](https://mochajs.org/) test framework and the [Chai](https://www.chaijs.com/) assertion library
- Fixtures for Knex using [simple-knex-fixtures](https://github.com/viglucci/simple-knex-fixtures)

**Client technologies:**
- The client is a [React](https://reactjs.org/) app, using [React Router](https://reacttraining.com/react-router/) for routing.
- It uses [Bootstrap](https://getbootstrap.com/) (both stand-alone and through [React Bootstrap](https://react-bootstrap.github.io/)) and [FontAwesome](https://fontawesome.com/) for graphical goodness.

## Build
1. Install requirements by running `yarn`
1. Setup a **PostgreSQL** database for **development**.
1. `$ touch .env`
1. Provide the following environment variables inside `.env`:
    - DB_HOST
    - DB_NAME
    - DB_USERNAME
    - DB_PASSWORD
    - SESSION_SECRET - to be used for creating sessions with `express-session`
    - LOGGING - optional value to be used with the [morgan](https://expressjs.com/en/resources/middleware/morgan.html) logger, eg. `common`, `dev`
1. Optional: specify a port number for serving the React frontend, in `client/.env`:
    - PORT
    Default as per `react-scripts start`: `3000`
1. Install **Redis**
    - If you have non-default Redis instance variables, add a **Redis URL** in `.env` as `REDIS_URL=redis://...`
1. Run the app: `yarn dev`

## Test
1. Setup a **PostgreSQL** database for **testing**.
1. Provide database connection parameters inside `.env`:
    - DB_TEST_NAME
    - DB_TEST_USERNAME
    - DB_TEST_PASSWORD
    - SESSION_SECRET - to be used for creating sessions with `express-session`
1. Run all tests: `yarn test`.
1. You can specify specific test types to run, eg. `yarn test:unit` for only unit tests, or `yarn test:behav` for only behavior/integration tests.


## Deployment: Heroku
1. Ensure that the server **port** is read from `process.env.PORT` - Heroku will set this for your deplyed app.
1. In your **database settings** for production, create a single property for **database URL**, instead of single properties for user name, password, host, etc. In this app, the config URL is read from `config`:
    ```javascript
      // In config/config.js:
      production: {
        connectionUrl: process.env.DB_URL,
        [...]

      // In knexfile.js:
      production: {
        client: 'postgresql',
        connection: config.connectionUrl,
        [...]
    ```
1. Install a **PostgreSQL** database on Heroku as follows:
    1. Install the PostgreSQL add-on:
        ````bash
        $ heroku addons:create heroku-postgresql:hobby-dev
        ````
        This will generate a **database name**, also retrievable by running `heroku pg:info`.
    1. Get the **database URL** (replace `<database_name>` with the name output by the previous step):
        ````bash
        $ heroku pg:credentials:url <database_name>
        ````
        The output will contain a few parts; select only the part that starts with `postgres://`
    1. Set the database URL for your app (replace the relevant placeholders):
        ````bash
        $ heroku config:set DB_URL='<database_url>' -a <app_name>
        ````
1. Provision **Redis** for your Heroku instance.
  There should be no further setup needed: the code will look for Heroku's Redis URL as `process.env.REDIS_URL`, and use it if found.
1. Push your source code to Heroku:
    ````bash
    $ git push heroku master
    ````
1. Run **knex migrations**:
    ````bash
    $ heroku run knex migrate:latest
    ````
1. Run **knex seeds**, if any:
    ````bash
    $ heroku run knex seed:run
    ````


***
#### References:
- [How to Deploy an Express App on Heroku with Postgres and Knex](https://codeselfstudy.com/blog/deploy-node-postgres-heroku/)
- [Setting the port for node.js server on Heroku (StackOverflow)](https://stackoverflow.com/questions/28706180/setting-the-port-for-node-js-server-on-heroku)
- [How To Make create-react-app work with a Node Back-end API](https://www.freecodecamp.org/news/how-to-make-create-react-app-work-with-a-node-backend-api-7c5c48acb1b0/)
- [Deploy React and Express to Heroku](https://daveceddia.com/deploy-react-express-app-heroku/)
