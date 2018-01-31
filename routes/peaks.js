const Peak = require('../models/Peak');
const User = require('../models/User');
const uuid = require('uuid/v4');

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

exports.create = (req, res) => {
  const { userId } = req.params;
  console.log('request body', req.body);
  const newPeak = {
    uuid: uuid(),
    userId
  };

  console.log('newPeak', newPeak);
  return Peak
    .query()
    .insert(newPeak)
    .then(() => {
      res.status(201);
    });
};
