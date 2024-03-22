/* eslint-disable no-console */
/* eslint-disable camelcase */
const Product = require('../models/product');
const genreController = require('./genreController');
const typeController = require('./typeController');

async function get_all(req, res) {
  try {
    const result = await Product.find().sort({ name: 1 });
    res.send(result);
  } catch (err) {
    console.log(err); // log error
  }
}

async function get_by_id(req, res) {
  const { id } = req.params;

  Product.findById(id)
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      console.log(err); // log error
    });
}

async function get_by_genre(req, res) {
  const { genreId } = req.params;

  try {
    const result = await Product.find({ genres: { $elemMatch: { _id: genreId } } });
    res.send(result);
  } catch (err) {
    console.log(err); // log error
  }
}

async function get_by_type(req, res) {
  const { typeId } = req.params;

  try {
    const result = await Product.find({ 'type._id': typeId });
    res.send(result);
  } catch (err) {
    console.log(err); // log error
  }
}

async function get_by_type_and_genre(req, res) {
  const { genreId, typeId } = req.params;

  try {
    const result = await Product.find({ $and: [{ genres: { $elemMatch: { _id: genreId } }, 'type._id': typeId }] });
    res.send(result);
  } catch (err) {
    console.log(err); // log error
  }
}

async function post(req, res) {
  const {
    name, description, price, number_in_stock, image, genres, type,
  } = req.body;

  // parse genres
  const genreArr = genres.toLowerCase().split(' ');
  const genreDocs = [];

  genreArr.forEach(async (genre) => {
    const genreDoc = await genreController.get_id(genre);
    if (!genreDoc.length > 0) return;
    genreDocs[genreDocs.length] = { name: genre, _id: genreDoc };
  });

  const typeId = await typeController.get_id(type);

  const newProduct = new Product({
    name,
    description,
    price,
    number_in_stock,
    image,
    genres: genreDocs,
    type: { name: type.toLowercase(), _id: typeId },
    stock_last_updated: new Date(),
    last_updated: new Date(),
  });

  newProduct.save()
    .then((result) => res.send(result))
    .catch((err) => {
      res.status(500).send(err);
    });
}

function update_stock(req, res) {
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

function decrement_stock(req, res) {
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
  get_all,
  get_by_id,
  get_by_genre,
  get_by_type,
  get_by_type_and_genre,
  post,
  update_stock,
  decrement_stock,
};
