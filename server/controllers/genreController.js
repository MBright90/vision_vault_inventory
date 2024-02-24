/* eslint-disable camelcase */
const Genre = require('../models/genre');

// genre_get_all

function genre_get_id(req, res, genre, genreArr) {
  // find genre and create if not found
  Genre.findOneAndUpdate({ name: genre }, { upsert: true })
    .then((result) => result)
    .catch((err) => res.status(500).send(err));

  // Potential efficient method
  Genre.updateMany({ name: { $in: genreArr } }, { upsert: true })
    .then((result) => result)
    .catch((err) => res.status(500).send(err));
}

function genre_get_all(req, res) {
  Genre.find()
    .sort({ name: 1 })
    .then((result) => {
      res.send(result); // Add actual information parsing here
    })
    .catch((err) => res.status(500).send(err));
}

function genre_get_products(req, res) {
  const { id } = req.params;

  Genre.findById(id)
    .then((result) => res.send(result))
    .catch((err) => res.status(500).send(err));
}

module.exports = {
  genre_get_id,
  genre_get_all,
  genre_get_products,
};
