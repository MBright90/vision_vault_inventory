/* eslint-disable camelcase */
const Genre = require('../models/genre');

async function get_id(req, res, genre) {
  // find genre and create if not found
  try {
    if (genre === '') return '';
    const lowerGen = genre.toLowerCase();
    const result = await Genre.findOneAndUpdate(
      { name: lowerGen },
      { name: lowerGen },
      { upsert: true },
    );
    return result;
  } catch (err) {
    res.status(500).send(err);
    throw err;
  }
}

function get_all(req, res) {
  Genre.find()
    .sort({ name: 1 })
    .then((result) => {
      res.send(result); // Add actual information parsing here
    })
    .catch((err) => res.status(500).send(err));
}

function add_product(req, res, genreId, productId) {
  const result = Genre.updateOne(
    { _id: genreId },
    { $push: { products: productId } },
  );
  return result;
}

function get_products(req, res) {
  const { id } = req.params;

  Genre.findById(id)
    .then((result) => res.send(result))
    .catch((err) => res.status(500).send(err));
}

module.exports = {
  get_id,
  get_all,
  add_product,
  get_products,
};
