const { Strategy: LocalStrategy } = require('passport-local');

// Assigns the Strategy export to the name JwtStrategy using object destructuring
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');

const User = require('./../models/User');
const { JWT_SECRET } = require('./config');

const localStrategy = new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password'
  },

  function (email, password, callback) {
    let user;

    return User
      .query()
      .where('email', email.toLowerCase())
      .then((_user) => {
        user = _user;
        if (user.length === 0) {
          return Promise.reject({
            code: 401,
            reason: 'LoginError',
            message: 'Incorrect email or password'
          });
        }
        // if user but no password and has facebook
        if (user.length === 1 && !user[0].password && user[0].facebookId) {
          return Promise.reject({
            code: 400,
            reason: 'LoginError',
            message: 'Invalid login, please try logging in with Facebook'
          });
        }

        return user[0].verifyPassword(password);
      })
      .then((isValid) => {
        if (!isValid) {
          return Promise.reject({
            code: 401,
            reason: 'LoginError',
            message: 'Incorrect email or password'
          });
        }
        return callback(null, user);
      })
      .catch((err) => {
        if (err.reason === 'LoginError') {
          return callback(null, false, err);
        }
        return callback(err, false);
      });
  }
);

const jwtStrategy = new JwtStrategy(
  {
    secretOrKey: JWT_SECRET,
    // look for the JWT as a Bearer auth header
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
    // only allow HS256 tokens - the same as the ones we issue
    algorithms: ['HS256']
  },

  function (payload, done) {
    return done(null, payload.user);
  }
);

module.exports = { localStrategy, jwtStrategy };
