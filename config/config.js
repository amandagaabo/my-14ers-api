require('dotenv').config();

exports.CLIENT_ORIGIN = process.env.CLIENT_ORIGIN;
exports.PORT = process.env.PORT;
exports.JWT_SECRET = process.env.JWT_SECRET;
exports.JWT_EXPIRY = '7d';
exports.FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID;
exports.FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET;
