/* eslint-disable no-console */
/* eslint-disable camelcase */
const Product = require('../models/product');
const genreController = require('./genreController');
const typeController = require('./typeController');

function validateProduct(product) {
  if (product.name.length < 2 || product.name.length > 150) return { err: 'Name does not meet requirements' };
  if (product.description.length > 500) return { err: 'Description exceeds permitted length of 500 characters' };
  if (product.price <= 0) return { err: 'Price incorrectly set' };
  if (product.number_in_stock <= 0) return { err: 'Stock incorrectly set' };
  if (product.genres.length <= 0) return { err: 'Minimum genres not met' };
  if (
    product.type.length <= 0
    || !['hardware', 'video/disc', 'game/disc', 'book'].includes(product.type.toLowerCase())
  ) return { err: 'Invalid product type chosen' };
  return true;
}

async function get_all(req, res) {
  try {
    const result = await Product.find().sort({ name: 1 });
    res.send(result);
  } catch (err) {
    console.log(err); // TODO: log error here later
    res.status(500).send(err);
  }
}

async function get_by_id(req, res) {
  const { id } = req.params;
  try {
    const result = await Product.findById(id);
    res.send(result);
  } catch (err) {
    console.log(err); // TODO: log error here later
    res.status(500).send(err);
  }
}

async function get_by_genre(req, res) {
  const { genreId } = req.params;

  try {
    const result = await Product.find(
      { genres: { $elemMatch: { _id: genreId } } },
    ).sort({ name: 1 });
    res.send(result);
  } catch (err) {
    console.log(err); // TODO: log error here later
    res.status(500).send(err);
  }
}

async function get_by_type(req, res) {
  const { typeId } = req.params;

  try {
    const result = await Product.find({ 'type._id': typeId }).sort({ name: 1 });
    res.send(result);
  } catch (err) {
    console.log(err); // TODO: log error here later
    res.status(500).send(err);
  }
}

async function get_by_type_and_genre(req, res) {
  const { genreId, typeId } = req.params;

  try {
    const result = await Product.find(
      { $and: [{ genres: { $elemMatch: { _id: genreId } }, 'type._id': typeId }] },
    ).sort({ name: 1 });
    res.send(result);
  } catch (err) {
    console.log(err); // TODO: log error here later
    res.status(500).send(err);
  }
}

async function post_product(req, res) {
  // Verify all required fields
  const validation = validateProduct(req.body);
  if (validation.err) {
    res.status(400).send({ err: validation.err });
    return;
  }

  console.log('validated');

  const {
    name, description, price, number_in_stock, genres, type,
  } = req.body;

  // parse genres and normalize
  const genreArr = genres.toLowerCase().split(',');
  genreArr.forEach((genre) => genre.trim());

  let formattedGenres = [];

  if (genreArr.length > 0 && genreArr[0] !== '') {
    formattedGenres = await Promise.all(genreArr.map(async (genre) => {
      const ID = await genreController.get_id(genre);
      return { name: genre, _id: ID };
    }));
  }

  const typeId = await typeController.get_id(type);

  try {
    const newProduct = new Product({
      name,
      description,
      price,
      number_in_stock,
      genres: formattedGenres,
      type: { name: type.toLowerCase(), _id: typeId },
      stock_last_updated: new Date(),
      last_updated: new Date(),
    });

    const result = await newProduct.save();

    // add product to genres
    result.genres.forEach((genre) => {
      genreController.add_product(genre, result._id);
    });
    // add product to type
    typeController.add_product(result.type._id, result._id);

    res.send(result);
  } catch (err) {
    console.log(err); // TODO: log error here later
    res.status(500).send(err);
  }
}

async function put_edit_product(req, res) {
  const { id } = req.params;

  const validation = validateProduct(req.body);
  if (validation.err) {
    res.status(400).send({ err: validation.err });
    return;
  }

  const {
    name, description, price, number_in_stock, genres, type,
  } = req.body;

  const genreArr = genres.toLowerCase().split(',');
  genreArr.forEach((genre) => genre.trim());

  let formattedGenres = [];

  if (genreArr.length > 0 && genreArr[0] !== '') {
    formattedGenres = await Promise.all(genreArr.map(async (genre) => {
      const ID = await genreController.get_id(genre);
      return { name: genre, _id: ID };
    }));
  }

  const typeId = await typeController.get_id(type);

  try {
    const result = await Product.findOneAndUpdate(
      { _id: id },
      {
        $set:
        {
          name,
          description,
          price,
          number_in_stock,
          genres: formattedGenres,
          type: { name: type.toLowerCase(), _id: typeId },
          stock_last_updated: new Date(),
          last_updated: new Date(),
        },
      },
      { upsert: true, new: true },
    );
    res.send(result);
  } catch (err) {
    console.log(err); // TODO: log error here later
    res.status(500).send(err);
  }
}

async function update_stock(req, res) {
  const { id } = req.params;
  const { increment } = req.body;

  try {
    const result = await Product.findOneAndUpdate(
      { _id: id },
      { $inc: { number_in_stock: increment }, $set: { stock_last_updated: new Date() } },
    );

    res.send(result);
  } catch (err) {
    console.log(err); // TODO: log error here later
    res.status(500).send(err);
  }
}

module.exports = {
  get_all,
  get_by_id,
  get_by_genre,
  get_by_type,
  get_by_type_and_genre,
  post_product,
  put_edit_product,
  update_stock,
};
