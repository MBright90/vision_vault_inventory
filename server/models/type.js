const mongoose = require('mongoose');

const TypeSchema = new mongoose.Schema({
  name: {
    type: String,
    enum: ['hardware', 'audio/disc', 'video/disc', 'game/disc'],
    required: true,
  },
  products: [{ type: mongoose.Types.ObjectId }],
});

module.exports = mongoose.model('type', TypeSchema);
