const Peak = require('../models/Peak');
const uuid = require('uuid/v4');

// list all user peaks
exports.list = (req, res) => {
  return Peak
    .query()
    .skipUndefined()
    .where('userId', req.params.userId)
    .then((peaks) => {
      res.json(peaks);
    });
};

// add new peak
exports.create = (req, res) => {
  const newPeak = {
    uuid: uuid(),
    userId: req.params.userId,
    peakName: req.body.peakName,
    dateClimbed: req.body.dateClimbed,
    notes: req.body.notes,
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
      res.status(201).json(peak);
    });
};

// delete one peak
exports.delete = (req, res) => {
  return Peak
    .query()
    .delete()
    .where('uuid', req.params.peakId)
    .then(() => {
      res.status(200).json({ message: 'peak deleted' });
    });
};
