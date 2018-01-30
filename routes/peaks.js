const Peak = require('../models/Peak');
const User = require('../models/User');


exports.list = (req, res) => {
  // find user by id
  return User.query().findById(req.params.userId)
    .then((user) => {
      if (!user) {
        console.log('no user found');
        throw createStatusCodeError(404);
      }
      // return user peaks
      return user
        .query()
        .skipUndefined()
        .where('userId', '=', req.query.userId);
    }).then((peaks) => {
      res.send(peaks);
    });
};
