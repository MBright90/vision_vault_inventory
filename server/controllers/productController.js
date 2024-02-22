/* eslint-disable no-underscore-dangle */
/* eslint-disable camelcase */
const Product = require('../models/product');

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

// function product_put(req, res) {
//   const { id } = req.params;

//   Product.EditById;
// }

function product_update_stock(req, res) {
  const { id } = req.params;
  const { increment } = req.body;

  Product.findOneAndUpdate({ _id: id }, { $inc: { number_in_stock: increment } })
    .then((result) => {
      res.send(result);
    }).catch((err) => res.status(500).send(err));
}

function product_decrement_stock(req, res) {
  const { id } = req.params;

  Product.findOneAndUpdate({ _id: id }, { $inc: { number_in_stock: -1 } })
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
