/* eslint-disable no-console */
/* eslint-disable camelcase */
const Genre = require('../models/genre');

async function get_id(genre, session = null) {
  // find genre and create if not found
  try {
    if (genre === '') return '';
    const lowerGen = genre.toLowerCase();
    const result = await Genre.findOneAndUpdate(
      { name: lowerGen },
      { name: lowerGen },
      { upsert: true, new: true, session },
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

async function add_product(genreId, productId, session = null) {
  const result = await Genre.updateOne(
    { _id: genreId },
    { $addToSet: { products: productId } },
    { session },
  );
  return result;
}

async function remove_product(genreId, productId, session = null) {
  const result = await Genre.updateOne(
    { _id: genreId },
    { $pull: { products: productId } },
    { session },
  );
  return result;
}

module.exports = {
  get_id,
  get_all,
  add_product,
  remove_product,
};
