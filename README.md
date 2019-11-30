# Lyrix
A Song Lyric collection app, containing both **Node** server and **React** client:
* In *development*, the **client** is accessed via the web. It proxies external URLs to the **server**.
* In *production*, the **server** is accessed via the web. It routes clients to a static build of the React **client**.

**Server technologies:**
- [Node.js](https://nodejs.org/en/)
- [Yarn package manager](https://yarnpkg.com/lang/en/)
- [Express framework](https://expressjs.com/)
- [PostgreSQL database](https://www.postgresql.org/)
- [Knex.js query builder](https://knexjs.org/)
- [Ojection.js ORM](https://vincit.github.io/objection.js/)

## Build
1. Install requirements by running `yarn`
1. Setup a **PostgreSQL** database for **development**.
1. `$ touch .env`
1. Provide database connection parameters inside `.env`:
    - DB_HOST
    - DB_NAME
    - DB_USERNAME
    - DB_PASSWORD
1. Run the app: `yarn dev`

## Test
1. Setup a **PostgreSQL** database for **testing**.
1. Provide database connection parameters inside `.env`:
    - DB_TEST_NAME
    - DB_TEST_USERNAME
    - DB_TEST_PASSWORD
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