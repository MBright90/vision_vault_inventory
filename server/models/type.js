const mongoose = require('mongoose');

const TypeSchema = new mongoose.Schema({
  name: {
    type: String,
    enum: ['hardware', 'video/disc', 'game/disc', 'book'],
    required: true,
    unique: true,
  },
  products: [{ type: mongoose.Types.ObjectId, ref: 'product' }],
});

module.exports = mongoose.model('type', TypeSchema);
