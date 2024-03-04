/* eslint-disable no-console */
const mongoose = require('mongoose');
const Product = require('../models/product');

// const testData = require('./testData/testData.js');
const productTestData = [];

// Connect to mongoDB database
mongoose.set('strictQuery', false);
const mongoDB = `mongodb+srv://${process.env.DB_UN}:${process.env.DB_PW}@development.74so7kt.mongodb.net/?retryWrites=true&w=majority`;

async function main() {
  mongoose.connect(mongoDB);
}

async function uploadTestProducts(dataArr) {
  try {
    Product.insertMany(dataArr);
  } catch (err) {
    console.log(err);
  }
}

// async function uploadTestTypes() {

// }

main()
  .then(uploadTestProducts(productTestData))
  .catch((err) => (console.log(err)));
