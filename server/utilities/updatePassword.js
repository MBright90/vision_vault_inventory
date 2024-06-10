/* eslint-disable no-console */
const mongoose = require('mongoose');
const readline = require('node:readline');
const bcrypt = require('bcrypt');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// connect to mongo database
mongoose.set('strictQuery', false);
const mongoDB = `mongodb+srv://${process.env.DB_UN}:${process.env.DB_PW}@development.74so7kt.mongodb.net/?retryWrites=true&w=majority`;

async function main() {
  mongoose.connect(mongoDB);
}

async function inputPassword() {
  rl.question('Enter new password:', (password) => {
    console.log(bcrypt.hashSync(password, 10));
    rl.close();
  });
}

main()
  .then(inputPassword())
  .catch((err) => console.log(err));
