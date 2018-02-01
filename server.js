require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
const router = require('./routes/index');
const { CLIENT_ORIGIN, PORT } = require('./config/config');
const { Model } = require('objection');
const Knex = require('knex');
const knexConfig = require('./knexfile');
const pg = require('pg');

// change decimal type from string to number
pg.types.setTypeParser(1700, 'text', parseFloat);

// setup database using knex with the current environment
const knex = Knex(knexConfig[process.env.NODE_ENV]);

// connect to database by binding all models to a knex instance
Model.knex(knex);

// setup app
const app = express()
  .use(bodyParser.json())
  // log the http layer middleware
  .use(morgan('common'))
  // cors middleware
  .use(cors({ origin: CLIENT_ORIGIN }))
  // router
  .use(router);

// server is used in runServer and closeServer so it is defined out here
let server;

function runServer() {
  return server = app.listen(PORT, () => {
    console.log(`Your app is listening on port ${PORT}`);
  });
}

// used for integration tests
function closeServer() {
  server.close();
}

// if server.js is called directly (aka, with `node server.js`), this block runs
if (require.main === module) {
  runServer();
}

module.exports = { app, runServer, closeServer };
