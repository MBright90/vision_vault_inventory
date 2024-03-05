/* eslint-disable no-console */
const mongoose = require('mongoose');

// const Product = require('../models/product');
const genreController = require('../controllers/genreController');
const testData = require('./testData/productData.json');

// Connect to mongoDB database
mongoose.set('strictQuery', false);
const mongoDB = `mongodb+srv://${process.env.DB_UN}:${process.env.DB_PW}@development.74so7kt.mongodb.net/?retryWrites=true&w=majority`;

async function main() {
  mongoose.connect(mongoDB);
}

async function uploadTestProducts(dataArr) {
  // eslint-disable-next-line no-unused-vars
  const mappedData = await Promise.all(dataArr.map(async (product) => {
    const genreArr = product.genres.split(',').map((item) => item.trim());

    let genreIDs = [];

    if (genreArr.length > 0) {
      genreIDs = await Promise.all(genreArr.map(async (genre) => {
        const ID = await genreController.genre_get_id(null, null, genre);
        return ID;
      }));
    }

    return {
      ...product, genres: genreIDs, last_updated: new Date(), stock_last_updated: new Date(),
    };
  }));

  console.log(mappedData);
}

//   try {
//     Product.insertMany(mappedData);
//   } catch (err) {
//     console.log(err);
//   }

main()
  .then(uploadTestProducts(testData))
  .catch((err) => (console.log(err)));

//   function product_post(req, res) {
//     const {
//       name, description, price, number_in_stock, image, genres, type,
//     } = req.body;

//     // parse genres
//     const genreArr = genres.split(' ');
//     const genreDocs = [];

//     genreArr.forEach((genre) => {
//       const genreDoc = genreController.genre_get_id(req, res, genre);
//       if (!genreDoc._id) return;
//       genreDocs[genreDocs.length] = genreDoc;
//     });

//     const newProduct = new Product({
//       name,
//       description,
//       price,
//       number_in_stock,
//       image,
//       genres: genreDocs,
//       type,
//       stock_last_updated: new Date(),
//       last_updated: new Date(),
//     });

//     newProduct.save()
//       .then((result) => res.send(result))
//       .catch((err) => {
//         res.status(500).send(err);
//       });
//   }
