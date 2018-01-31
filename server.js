require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
const router = require('./routes/index');
const { Client } = require('pg');
const { CLIENT_ORIGIN, PORT, DATABASE_URL } = require('./config');
const { Model } = require('objection');
const Knex = require('knex');
const knexConfig = require('./knexfile');

// initialize knex
const knex = Knex(knexConfig.test);

// bind all models to a knex instance
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

// setup server and client
let server;
let client;

// connect to database, then start the server
function runServer(databaseUrl = DATABASE_URL) {
  // setup database client
  client = new Client({
    connectionString: databaseUrl,
    ssl: process.env.NODE_ENV !== 'development'
  });

  // connect to client
  return client.connect()
    .then(() => {
      console.log('Connected to database', databaseUrl);

      // connect to server
      server = app.listen(PORT, () => {
        console.log(`Your app is listening on port ${PORT}`);
      });

      server.on('error', (err) => {
        console.error(err);
        client.end();
      });

      // have to return something even if it is null
      return null;
    });
}

// this function closes the server and returns a promise
// used for integration tests
function closeServer() {
  // disconnect from client
  return client.end()
    .then(() => {
      console.log('Database disconnected, closing server');
      // close server
      server.close();
    });
}

// if server.js is called directly (aka, with `node server.js`), this block runs
if (require.main === module) {
  runServer()
    .then(() => console.log('run server called'))
    .catch(err => console.error(err));
}

module.exports = { app, runServer, closeServer };
