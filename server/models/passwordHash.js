const mongoose = require('mongoose');

const PasswordHashSchema = mongoose.Schema({
  hash: { type: String, required: true },
});

module.exports = mongoose.model('passwordHash', PasswordHashSchema);
