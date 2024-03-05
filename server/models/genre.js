const mongoose = require('mongoose');

const GenreSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  products: [{ type: mongoose.Types.ObjectId, ref: 'product' }],
});

module.exports = mongoose.model('genre', GenreSchema);
