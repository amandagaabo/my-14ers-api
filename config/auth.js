const { Strategy: LocalStrategy } = require('passport-local');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const { Strategy: FacebookStrategy } = require('passport-facebook');

const User = require('./../models/User');
const {
  JWT_SECRET,
  CLIENT_ORIGIN,
  FACEBOOK_APP_ID,
  FACEBOOK_APP_SECRET
} = require('./config');
const uuid = require('uuid/v4');

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
            reason: 'LoginError',
            message: 'Incorrect email or password'
          });
        }
        return user[0].verifyPassword(password);
      })
      .then((isValid) => {
        if (!isValid) {
          return Promise.reject({
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

const facebookStrategy = new FacebookStrategy(
  {
    clientID: FACEBOOK_APP_ID,
    clientSecret: FACEBOOK_APP_SECRET,
    callbackURL: `${CLIENT_ORIGIN}/auth/facebook/callback`
  },

  function (accessToken, refreshToken, profile, done) {
    // search db for user with facebook id
    return User
      .query()
      .where('facebookId', profile.id)
      .then((user) => {
        // if user is found, return user
        if (user.length === 1) {
          return done(null, user);
        }

        // if no user with facebook id, check email
        if (user.length === 0) {
          return User
            .query()
            .where('email', profile.email)
            .then((user) => {
              // if user is found, add facebook id for user then return user
              if (user.length === 1) {
                return User
                  .query()
                  .patch({ facebookId: profile.id })
                  .where('email', profile.email)
                  .then((user) => {
                    return user;
                  });
              }
              // if no user is found, create new user with email and facebook id
              return User
                .query()
                .insert({
                  uuid: uuid(),
                  email: profile.email,
                  facebookId: profile.id
                })
                .then((user) => {
                  return user;
                });
            });
        }
        return done();
      })
      .catch((err) => {
        return done(err);
      });
  }
);

module.exports = { localStrategy, jwtStrategy, facebookStrategy };
