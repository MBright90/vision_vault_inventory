/* eslint-disable no-console */
/* eslint-disable camelcase */
const Genre = require('../models/genre');

async function get_id(genre, session = null) {
  console.log(genre);
  // find genre and create if not found
  try {
    if (genre === '') return '';

    const lowerGen = genre.toLowerCase();

    const options = { upsert: true, new: true };
    if (session) options.session = session;

    const result = await Genre.findOneAndUpdate(
      { name: lowerGen },
      { name: lowerGen },
      options,
    );
    return result._id;
  } catch (err) {
    console.log(err); // log error
    return null;
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

async function add_product(genreId, productId, session) {
  try {
    const options = session ? { session } : {};
    const result = await Genre.updateOne(
      { _id: genreId },
      { $addToSet: { products: productId } },
      options,
    );
    return result;
  } catch (err) {
    console.log(`Error adding product ${productId} to genre ${genreId}: ${err}`);
    throw err;
  }
}

async function remove_product(genreId, productId, session) {
  try {
    const options = session ? { session } : {};
    const result = await Genre.updateOne(
      { _id: genreId },
      { $pull: { products: productId } },
      options,
    );

    console.log(`${productId} removed from genre ${genreId}`);
    return result;
  } catch (err) {
    console.log(`Error removing product ${productId} from genre ${genreId}: ${err}`);
    throw err;
  }
}

module.exports = {
  get_id,
  get_all,
  add_product,
  remove_product,
};
