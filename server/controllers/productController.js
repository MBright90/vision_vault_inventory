/* eslint-disable no-underscore-dangle */
/* eslint-disable camelcase */
const Product = require('../models/product');
const genreController = require('./genreController');

// product_get, product_post, product_put, product_delete

function product_get(req, res) {
  const { id } = req.params;

  Product.findById(id)
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
}

function product_post(req, res) {
  const {
    name, description, price, number_in_stock, image, genres, type,
  } = req.body;

  // parse genres
  const genreArr = genres.split(' ');
  const genreDocs = [];

  genreArr.forEach((genre) => {
    const genreDoc = genreController.genre_get_id(req, res, genre);
    if (!genreDoc._id) return;
    genreDocs[genreDocs.length] = genreDoc;
  });

  const newProduct = new Product({
    name,
    description,
    price,
    number_in_stock,
    image,
    genreDocs,
    type,
    stock_last_updated: new Date(),
    last_updated: new Date(),
  });

  newProduct.save()
    .then((result) => res.send(result))
    .catch((err) => {
      res.status(500).send(err);
    });
}

function product_update_stock(req, res) {
  const { id } = req.params;
  const { increment } = req.body;

  Product.findOneAndUpdate(
    { _id: id },
    { $inc: { number_in_stock: increment }, $set: { stock_last_updated: new Date() } },
  )
    .then((result) => {
      res.send(result);
    }).catch((err) => res.status(500).send(err));
}

function product_decrement_stock(req, res) {
  const { id } = req.params;

  Product.findOneAndUpdate(
    { _id: id },
    { $inc: { number_in_stock: -1 }, $set: { stock_last_updated: new Date() } },
  )
    .then((result) => {
      res.send(result);
    }).catch((err) => res.status(500).send(err));
}

module.exports = {
  product_get,
  product_post,
  product_update_stock,
  product_decrement_stock,
};
