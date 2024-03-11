/* eslint-disable camelcase */
const Genre = require('../models/genre');

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
    // eslint-disable-next-line no-console
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
