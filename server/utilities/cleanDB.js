/* eslint-disable no-console */
const mongoose = require('mongoose');

// model imports
const Genre = require('../models/genre');

// Connect to mongoDB database
mongoose.set('strictQuery', false);
const mongoDB = `mongodb+srv://${process.env.DB_UN}:${process.env.DB_PW}@development.74so7kt.mongodb.net/?retryWrites=true&w=majority`;

async function main() {
  mongoose.connect(mongoDB);
}

async function cleanGenres() {
  try {
    const result = await Genre.deleteMany({ 'products.0': { $exists: false } });
    console.log(`Empty genres deleted: { acknowledged: ${result.acknowledged}, deleted: ${result.deletedCount} }`);
  } catch (err) {
    console.log(err);
  }
}

main()
  .then(cleanGenres())
  .catch((err) => (console.log(err)));
