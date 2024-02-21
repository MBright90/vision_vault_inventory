/* eslint-disable camelcase */
const Product = require('../models/product');

// product_get, product_post, product_put, product_delete

function product_details_get(req, res) {
  const { id } = req.params;

  Product.findById(id)
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
}

function product_put(req, res) {
  const {
    name, description, price, number_in_stock, image,
  } = req.body;

  const newProduct = new Product({
    name, description, price, number_in_stock, image,
  });

  newProduct.save()
    .then((result) => res.send(result))
    .catch((err) => {
      res.status(500).send(err);
    });
}

module.exports = {
  product_details_get,
  product_put,
};
