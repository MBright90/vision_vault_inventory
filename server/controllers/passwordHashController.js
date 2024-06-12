/* eslint-disable no-console */
/* eslint-disable camelcase */
const bcrypt = require('bcrypt');
const PasswordHash = require('../models/passwordHash');

async function get_password_hash(req, res) {
  try {
    const result = await PasswordHash.findOne({ _id: 1 });
    res.send(result);
  } catch (err) {
    console.log(err);
  }
}

async function set_password(password) {
  const hash = bcrypt.hashSync(password, 10);
  try {
    const result = await PasswordHash.save({
      _id: 1,
      hash,
    });
    return result;
  } catch (err) {
    console.log(err);
    return -1;
  }
}

async function update_password_hash(newPassword) {
  const hash = bcrypt.hashSync(newPassword, 10);
  try {
    const result = await PasswordHash.findOneAndUpdate({ _id: 1 }, { hash });
    return result;
  } catch (err) {
    console.log(err);
    return -1;
  }
}

module.exports = {
  get_password_hash,
  set_password,
  update_password_hash,
};
