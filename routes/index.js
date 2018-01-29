const express = require('express');

const router = express.Router();

// catch-all endpoint if client makes request to non-existent endpoint
router.get('*', (req, res) => {
  res.status(404).json({ message: '404 Not Found' });
});

module.exports = router;
