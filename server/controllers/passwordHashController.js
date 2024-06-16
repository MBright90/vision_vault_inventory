/* eslint-disable no-console */
/* eslint-disable camelcase */
const bcrypt = require('bcrypt');
const PasswordHash = require('../models/passwordHash');

async function compare_password_hash(req, res) {
  const { reqHash } = req.body;
  try {
    const result = await PasswordHash.findOne({ _id: 'admin' });
    const { hash } = result;
    if (reqHash === hash) console.log('valid');
    else console.log('invalid');
    res.send('');
  } catch (err) {
    console.log(err);
    res.send(-1);
  }
}

async function get_password_hash(req, res) {
  try {
    const result = await PasswordHash.findOne({ _id: 'admin' });
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
    const result = await PasswordHash.findOneAndUpdate({ _id: 'admin' }, { hash });
    return result;
  } catch (err) {
    console.log(err);
    return -1;
  }
}

module.exports = {
  compare_password_hash,
  get_password_hash,
  set_password,
  update_password_hash,
};
