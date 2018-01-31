const Peak = require('../models/Peak');

// list all user peaks
exports.list = (req, res) => {
  return Peak
    .query()
    .skipUndefined()
    .where('userId', req.params.userId)
    .then((peaks) => {
      res.send(JSON.stringify(peaks));
    });
};
