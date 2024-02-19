const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: { type: String, require: true, maxLength: 150 },
  description: { type: String, maxLength: 500 },
  price: { type: Number },
  number_in_stock: { type: Number, require: true },
  image: { type: String },
});

module.exports = mongoose.model('product', ProductSchema);
