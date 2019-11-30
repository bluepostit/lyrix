# Lyrix
A Song Lyric collection app.

**Server technologies:**
- [Node.js](https://nodejs.org/en/)
- [Express framework](https://expressjs.com/)
- [Knex.js query builder](https://knexjs.org/)
- [Ojection.js ORM](https://vincit.github.io/objection.js/)

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