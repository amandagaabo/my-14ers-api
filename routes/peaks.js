const Peak = require('../models/Peak');
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
  const newPeak = {
    uuid: uuid(),
    userId: req.params.userId,
    peakName: req.body.peak_name,
    dateClimbed: req.body.dateClimbed,
    notes: req.body.notes || null,
    imgSrc: req.body.imgSrc,
    range: req.body.range,
    rank: req.body.rank,
    elevation: parseInt(req.body.elevation, 10),
    latitude: req.body.latitude,
    longitude: req.body.longitude
  };

  return Peak
    .query()
    .insert(newPeak)
    .then((peak) => {
      res.status(201).send(peak);
    });
};
