/* eslint-disable no-console */
/* eslint-disable camelcase */
const Genre = require('../models/genre');
const Product = require('../models/product');

async function get_id(genre) {
  // find genre and create if not found
  try {
    if (genre === '') return '';
    const lowerGen = genre.toLowerCase();
    const result = await Genre.findOneAndUpdate(
      { name: lowerGen },
      { name: lowerGen },
      { upsert: true, new: true },
    );
    return result._id;
  } catch (err) {
    console.log(err); // log error
    throw err;
  }
}

async function get_all(req, res) {
  try {
    const result = await Genre.find().sort({ name: 1 });
    res.send(result);
  } catch (err) {
    console.log(err); // log error
  }
}

async function add_product(genreId, productId) {
  const result = await Genre.updateOne(
    { _id: genreId },
    { $push: { products: productId } },
  );
  return result;
}

async function get_genre_products(req, res) {
  const { id } = req.params;

  try {
    const result = await Genre.findById(id); // works up to here
    const productResult = await Product.find({ _id: { $in: result.products } }).sort({ name: 1 });
    res.send(productResult);
  } catch (err) {
    console.log(err); // log error
  }
}

module.exports = {
  get_id,
  get_all,
  add_product,
  get_genre_products,
};
