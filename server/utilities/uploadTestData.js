/* eslint-disable no-console */
const mongoose = require('mongoose');

// models
// const Product = require('../models/product');

// controllers
const genreController = require('../controllers/genreController');
const typeController = require('../controllers/typeController');

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

    let genreIds = [];

    if (genreArr.length > 0) {
      genreIds = await Promise.all(genreArr.map(async (genre) => {
        const ID = await genreController.get_id(genre);
        console.log(ID);
        return ID;
      }));
    }

    const typeId = await typeController.get_id(product.type);

    return {
      ...product,
      genres: genreIds,
      type: typeId,
      last_updated: new Date(),
      stock_last_updated: new Date(),
    };
  }));

  console.log(mappedData);

  //   mappedData.forEach((item) => {
  //     try {
  //       const productDoc = new Product(item);
  //       const productId = productDoc.save();

  //       productDoc.genres.forEach((genre) => {
  //         genreController.add_product(genre, productId);
  //       });

//       typeController.add_product(productDoc.type, productId);
//     } catch (err) {
//       console.log(err);
//     }
//   });
}

main()
  .then(uploadTestProducts(testData))
  .catch((err) => (console.log(err)));
