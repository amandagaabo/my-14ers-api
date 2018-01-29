require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const { Client } = require('pg');
const { CLIENT_ORIGIN, PORT, DATABASE_URL } = require('./config');

// setup app
const app = express();

// setup database client
const client = new Client({
  connectionString: DATABASE_URL,
  ssl: process.env.NODE_ENV !== 'development'
});

// log the http layer middleware
app.use(morgan('common'));

// use cors middleware
app.use(cors({ origin: CLIENT_ORIGIN }));


// setup routes

// setup server
let server;

// connect to database, then start the server
function runServer() {
  return client.connect()
    .then(() => {
      server = app.listen(PORT, () => {
        console.log(`Your app is listening on port ${PORT}`);
      });

      server.on('error', () => {
        client.end();
      });

      // have to return something even if it is null
      return null;
    });
}

// this function closes the server and returns a promise
// used for integration tests
function closeServer() {
  return client.end()
    .then(() => {
      console.log('Closing server');
      server.close();
    });
}

// if server.js is called directly (aka, with `node server.js`), this block runs
if (require.main === module) {
  runServer()
    .then(() => console.log('good to go'))
    .catch(err => console.error(err));
}

module.exports = { app, runServer, closeServer };
