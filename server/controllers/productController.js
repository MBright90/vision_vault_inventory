/* eslint-disable no-console */
/* eslint-disable camelcase */
const { default: mongoose } = require('mongoose');
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
    console.log(err);
    res.status(500).send(err);
  }
}

async function get_by_id(req, res) {
  const { id } = req.params;
  try {
    const result = await Product.findById(id);
    res.send(result);
  } catch (err) {
    console.log(err);
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
    console.log(err);
    res.status(500).send(err);
  }
}

async function get_by_type(req, res) {
  const { typeId } = req.params;

  try {
    const result = await Product.find({ 'type._id': typeId }).sort({ name: 1 });
    res.send(result);
  } catch (err) {
    console.log(err);
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
    console.log(err);
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

  const {
    name, description, price, number_in_stock, genres, type,
  } = req.body;

  // parse genres and normalize
  const genreArr = genres.toLowerCase().split(',');
  const trimmedGenres = genreArr.map((genre) => genre.trim());

  // Begin mongodb session and start transaction - Ensure changes only occur if all are successful
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    let formattedGenres = [];

    if (genreArr.length > 0 && genreArr[0] !== '') {
      formattedGenres = await Promise.all(trimmedGenres.map(async (genre) => {
        const ID = await genreController.get_id(genre, session);
        return { name: genre, _id: ID };
      }));
    }

    const typeId = await typeController.get_id(type, session);

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

    const result = await newProduct.save({ session });

    // add product to genres
    await Promise.all(result.genres.map(async (genre) => {
      await genreController.add_product(genre._id, result._id, session);
    }));

    // add product to type
    await typeController.add_product(result.type._id, result._id, session);

    await session.commitTransaction();
    session.endSession();

    res.send(result);
  } catch (err) {
    await session.abortTransaction();
    session.endSession();

    console.log(err);
    res.status(500).send(err);
  }
}

async function put_edit_product(req, res) {
  const { id } = req.params;

  // verify all required fields
  const validation = validateProduct(req.body);
  if (validation.err) {
    res.status(400).send({ err: validation.err });
    return;
  }

  const {
    name, description, price, number_in_stock, genres, prevGenres, type,
  } = req.body;

  // parse genres and normalize
  const genreArr = genres.toLowerCase().split(',');
  const trimmedGenres = genreArr.map((genre) => genre.trim());

  // Begin mongodb session and start transaction - Ensure changes only occur if all are successful
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    let formattedGenres = [];

    if (genreArr.length > 0 && genreArr[0] !== '') {
      formattedGenres = await Promise.all(trimmedGenres.map(async (genre) => {
        const ID = await genreController.get_id(genre, session);
        return { name: genre, _id: ID };
      }));
    }

    const typeId = await typeController.get_id(type, session);

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
      { upsert: true, new: true, session },
    );

    // add products to genres if unique
    await Promise.all(result.genres.map(async (genre) => {
      await genreController.add_product(genre._id, result._id, session);
    }));

    // add product to type if unique
    if (result.type.name !== type) {
      typeController.add_product(result.type._id, id, session);
      // remove product from old type if changed
    }

    // remove product from removed genres
    await Promise.all(prevGenres.map(async (prevGenreId) => {
      if (!result.genres.includes((genre) => genre._id === prevGenreId)) {
        await genreController.remove_product(prevGenreId, id, session);
      }
    }));

    console.log('FIVE');

    await session.commitTransaction();
    session.endSession();

    res.send(result);
  } catch (err) {
    // Handle transaction abortion
    await session.abortTransaction();
    session.endSession();

    console.log(err); // TODO: log error here later
    res.status(500).send(err);
  }
}

async function put_update_stock(req, res) {
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

async function delete_product(req, res) {
  const { id } = req.params;
  const { genreIds, typeId } = req.body;

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const result = await Product.deleteOne({ _id: id }, { session });

    // remove product from genres
    await Promise.all(genreIds.map(async (genreId) => {
      await genreController.remove_product(genreId, id, session);
    }));

    // remove product from type
    await typeController.remove_product(typeId, id, session);

    await session.commitTransaction();
    session.endSession();

    res.send(result);
  } catch (err) {
    await session.abortTransaction();
    session.endSession();

    console.log(`Error deleting product ${id}: ${err}`);
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
  put_update_stock,
  delete_product,
};
