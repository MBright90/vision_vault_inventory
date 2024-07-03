/* eslint-disable no-console */
const mongoose = require('mongoose');
const readline = require('node:readline');
const bcrypt = require('bcrypt');

const passwordHashController = require('../controllers/passwordHashController');

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
  rl.question('Enter new password:', async (password) => {
    const hash = bcrypt.hashSync(password, 10);

    if (hash.length > 0) {
      try {
        if (hash.length > 0) {
          const result = await passwordHashController.update_password_hash(hash);
          if (result.ok) console.log('Password update successful');
          else console.log('Unsuccessful');
        }
      } catch (err) {
        console.log(`Password update unsuccessful: ${err}`);
      }
    } else console.log('Password update unsuccessful');

    rl.close();
  });
}

main()
  .then(inputPassword())
  .catch((err) => console.log(err));
