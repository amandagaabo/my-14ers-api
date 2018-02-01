const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { JWT_SECRET, JWT_EXPIRY } = require('../config/config');
const uuid = require('uuid/v4');

const createAuthToken = (user) => {
  return jwt.sign({ user }, JWT_SECRET, {
    subject: user.email,
    expiresIn: JWT_EXPIRY,
    algorithm: 'HS256'
  });
};

exports.loginSubmit = (req, res) => {
  const authToken = createAuthToken(req.user.apiRepr());
  res.json({ authToken });
};

exports.refreshToken = (req, res) => {
  const authToken = createAuthToken(req.user);
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
      min: 10,
      // bcrypt truncates after 72 characters, so let's not give the illusion
      // of security by storing extra (unused) info
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
      if (user.length > 0) {
        // reject if there is an existing user with the same email
        return Promise.reject({
          code: 422,
          reason: 'ValidationError',
          message: 'Email already taken',
          location: 'email'
        });
      }
      return User
        .query()
        .insert({
          email,
          password,
          uuid: uuid()
        })
        .then((user) => {
          res.status(201).json(user);
        });
    })
    .then((user) => {
      return res.status(201).json(user.apiRepr());
    })
    .catch((err) => {
      // Forward validation errors on to the client, otherwise give a 500
      // error because something unexpected has happened
      if (err.reason === 'ValidationError') {
        return res.status(err.code).json(err);
      }
      res.status(500).json({ message: 'Internal server error' });
      return Promise.resolve();
    });
};
