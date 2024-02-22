/* eslint-disable camelcase */
const Genre = require('../models/genre');

// genre_get_all

function genre_get_all(req, res) {
  Genre.find()
    .sort({ name: 1 })
    .then((result) => {
      res.send(result); // Add actual information parsing here
    });
}

function genre_get_products(req, res) {
  const { id } = req.params;

  Genre.findById(id)
    .then((result) => res.send(result))
    .catch((err) => res.status(500).send(err));
}

module.exports = {
  genre_get_all,
  genre_get_products,
};
