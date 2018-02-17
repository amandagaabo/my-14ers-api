const jwt = require('jsonwebtoken');
const User = require('./../models/User');
const { JWT_SECRET } = require('../config/config');
const uuid = require('uuid/v4');

const createAuthToken = (user) => {
  try {
    return jwt.sign({ user }, JWT_SECRET, {
      subject: user.email,
      expiresIn: '7d',
      algorithm: 'HS256'
    });
  } catch (err) {
    return console.error(err);
  }
};

exports.facebookAuth = (req, res) => {
  if (!req.body.accessToken) {
    return res.status(401).json({ message: 'Facebook login error' });
  }

  const facebookId = req.body.userID;
  const facebookEmail = req.body.email;

  // search db for user with facebook id
  return User
    .query()
    .where('facebookId', facebookId)
    .then((user) => {
      // if no user with facebook id, check email
      if (user.length === 0) {
        return User
          .query()
          .where('email', facebookEmail)
          .then((user) => {
            // if user is found, add facebook id for user then return user
            if (user.length === 1) {
              return User
                .query()
                .patch({ facebookId })
                .where('email', facebookEmail)
                .then(() => {
                  // find user and return
                  return User
                    .query()
                    .where('email', facebookEmail)
                    .then((user) => {
                      return user[0];
                    });
                });
            }
            // if no user is found, create new user with email and facebook id
            return User
              .query()
              .insert({
                uuid: uuid(),
                email: facebookEmail,
                facebookId
              })
              .then((user) => {
                return user;
              });
          });
      }
      // return user if user is found
      return user[0];
    })
    // create auth token with email and uuid
    .then((user) => {
      return createAuthToken({
        email: user.email,
        uuid: user.uuid
      });
    })
    // send authToken
    .then((authToken) => {
      res.json({ authToken });
    });
};

exports.loginSubmit = (req, res) => {
  // get uuid for user
  return User
    .query()
    .skipUndefined()
    .where('email', req.body.email)
    .then((user) => {
      return user[0].uuid;
    })
    // create auth token with email and uuid
    .then((uuid) => {
      return createAuthToken({
        email: req.body.email,
        uuid
      });
    })
    // send authToken
    .then((authToken) => {
      res.json({ authToken });
    })
    .catch(err => console.error(err))
};

exports.refreshToken = (req, res) => {
  const authToken = createAuthToken({
    email: req.user.email,
    uuid: req.user.uuid
  });
  res.json({ authToken });
};

exports.signUpSubmit = (req, res) => {
  // check required fields
  const requiredFields = ['email', 'password'];
  const missingField = requiredFields.find(field => !(field in req.body));

  if (missingField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Missing field',
      location: missingField
    });
  }

  // check for whitespace in email or password
  const explicityTrimmedFields = ['email', 'password'];
  const nonTrimmedField =
    explicityTrimmedFields
      .find(field => req.body[field].trim() !== req.body[field]);

  if (nonTrimmedField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Cannot start or end with whitespace',
      location: nonTrimmedField
    });
  }

  // check field lengths
  const sizedFields = {
    email: {
      min: 1
    },
    password: {
      min: 8,
      // bcrypt truncates after 72 characters
      max: 72
    }
  };

  const tooSmallField =
    Object.keys(sizedFields)
      .find(field =>
        'min' in sizedFields[field] && req.body[field].trim().length < sizedFields[field].min);

  const tooLargeField =
    Object.keys(sizedFields).find(field =>
      'max' in sizedFields[field] && req.body[field].trim().length > sizedFields[field].max);

  if (tooSmallField || tooLargeField) {
    return res.status(422).json({
      reason: 'ValidationError',
      message: tooSmallField
        ? `Must be at least ${sizedFields[tooSmallField]
          .min} characters long`
        : `Must be at most ${sizedFields[tooLargeField]
          .max} characters long`,
      location: tooSmallField || tooLargeField
    });
  }

  const { email, password } = req.body;

  return User
    .query()
    .skipUndefined()
    .where('email', email)
    .then((user) => {
      // reject if there is an existing user with the same email
      if (user.length > 0) {
        return Promise.reject({
          code: 422,
          reason: 'ValidationError',
          message: 'Email already taken',
          location: 'email'
        });
      }

      // else create new user
      return User
        .query()
        .insert({
          uuid: uuid(),
          email,
          password
        });
    })
    .then((user) => {
      // do not return password after user is created
      return res.status(201).json({
        email: user.email,
        uuid: user.uuid
      });
    })
    .catch((err) => {
      // send validation errors to the client, otherwise give a 500
      // error because something unexpected has happened
      if (err.reason === 'ValidationError') {
        return res.status(err.code).json(err);
      }
      return res.status(500).json({ message: 'Internal server error' });
    });
};
