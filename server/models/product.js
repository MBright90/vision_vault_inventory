const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: {
    type: String, required: true, minLength: 2, maxLength: 150, unique: true,
  },
  description: { type: String, maxLength: 500 },
  price: { type: Number, required: true },
  number_in_stock: { type: Number, required: true, minimum: 0 },
  image: {
    type: Buffer,
    contentType: String,
  },
  genres: [{
    name: { type: String },
    _id: {
      type: mongoose.Schema.ObjectId,
      ref: 'genre',
    },
  }],
  type: {
    name: { type: String },
    _id: {
      type: mongoose.Schema.ObjectId,
      ref: 'type',
      required: true,
    },
  },
  stock_last_updated: { type: Date, required: true },
  last_updated: { type: Date, required: true },
});

function validateImage(image) {
  // Check file has correct criteria
  if (!image || !image.data || !image.contentType) return false;

  // Check file type
  const contentType = image.contentType.toLowerCase();
  const acceptedFormats = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];
  if (!acceptedFormats.includes(contentType)) return false;

  // Check file size
  const maxFileSize = 5 * 1024 * 1024; // 5mb
  if (image.data.length > maxFileSize) return false;

  return true;
}

ProductSchema.path('image').validate(validateImage, 'Image Filetype is required');

module.exports = mongoose.model('product', ProductSchema);
