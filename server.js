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
const passport = require('passport');
const { localStrategy, jwtStrategy } = require('./config/auth');

// change decimal type from string to number
pg.types.setTypeParser(1700, 'text', parseFloat);

// setup database using knex with the current environment
console.log('node env', process.env.NODE_ENV);
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

// setup auth strategies
app.use(passport.initialize());
passport.use(localStrategy);
passport.use(jwtStrategy);

// server is used in runServer and closeServer so it is defined out here
let server;

function runServer() {
  return new Promise((resolve, reject) => {
    server = app.listen(PORT, () => {
      console.log(`Your app is listening on port ${PORT}`);
      resolve();
    })
      .on('error', (err) => {
        reject(err);
      });
  });
}

// used for integration tests
function closeServer() {
  return new Promise((resolve, reject) => {
    console.log('Closing server');
    server.close((err) => {
      if (err) {
        reject(err);
      }
      resolve();
    });
  });
}

// if server.js is called directly (aka, with `node server.js`), this block runs
if (require.main === module) {
  runServer();
}

module.exports = { app, runServer, closeServer };
