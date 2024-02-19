const mongoose = require('mongoose');

const GenreSchema = new mongoose.Schema({
  name: { type: String, required: true },
  products: [{ type: mongoose.Types.ObjectId, required: true }],
});

module.exports = mongoose.model('genre', GenreSchema);
