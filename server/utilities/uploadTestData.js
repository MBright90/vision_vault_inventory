/* eslint-disable no-console */
const mongoose = require('mongoose');

// models
const Product = require('../models/product');

// controllers
const genreController = require('../controllers/genreController');

// data
const testData = require('./testData/productData.json');

// Connect to mongoDB database
mongoose.set('strictQuery', false);
const mongoDB = `mongodb+srv://${process.env.DB_UN}:${process.env.DB_PW}@development.74so7kt.mongodb.net/?retryWrites=true&w=majority`;

async function main() {
  mongoose.connect(mongoDB);
}

async function uploadTestProducts(dataArr) {
  const mappedData = await Promise.all(dataArr.map(async (product) => {
    const genreArr = product.genres.split(',').map((item) => item.trim());

    let genreIDs = [];

    if (genreArr.length > 0) {
      genreIDs = await Promise.all(genreArr.map(async (genre) => {
        const ID = await genreController.get_id(null, null, genre);
        return ID;
      }));
    }

    return {
      ...product, genres: genreIDs, last_updated: new Date(), stock_last_updated: new Date(),
    };
  }));

  console.log(mappedData);

  mappedData.forEach((item) => {
    try {
      const productDoc = new Product(item);
      const productID = productDoc.save();

      productDoc.genres.forEach((genre) => {
        genreController.add_product(null, null, genre, productID);
      });
    } catch (err) {
      console.log(err);
    }
    // Do same for types
  });
}

main()
  .then(uploadTestProducts(testData))
  .catch((err) => (console.log(err)));
