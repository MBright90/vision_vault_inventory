const mongoose = require('mongoose');

const PasswordHashSchema = mongoose.Schema({
  type: { type: String, enum: ['admin'], unique: true },
  hash: { type: String, required: true },
});

module.exports = mongoose.model('passwordHash', PasswordHashSchema);
