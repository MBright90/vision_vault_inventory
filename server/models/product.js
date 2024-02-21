const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true, maxLength: 150 },
  description: { type: String, maxLength: 500 },
  price: { type: Number, required: true },
  number_in_stock: { type: Number, required: true },
  image: { type: String },
});

module.exports = mongoose.model('product', ProductSchema);
