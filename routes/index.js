const express = require('express');
const passport = require('passport');
const sessions = require('./sessions');
const peaks = require('./peaks');

const router = express.Router();
const localAuth = passport.authenticate('local', { session: false });
const jwtAuth = passport.authenticate('jwt', { session: false });

// session routes
router.post('/sign-up', sessions.signUpSubmit);
router.post('/login', localAuth, sessions.loginSubmit);
router.post('/refresh', jwtAuth, sessions.refreshToken);
router.post('/auth/facebook', sessions.facebookAuth);

// peak routes
router.get('/users/:userId/peaks', jwtAuth, peaks.list);
router.post('/users/:userId/peaks', jwtAuth, peaks.create);
router.put('/users/:userId/:peakId', jwtAuth, peaks.update);
router.delete('/users/:userId/:peakId', jwtAuth, peaks.delete);

// catch-all endpoint if client makes request to non-existent endpoint
router.get('*', (req, res) => {
  res.status(404).json({ message: '404 Not Found' });
});

module.exports = router;
