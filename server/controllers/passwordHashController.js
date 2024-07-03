/* eslint-disable no-console */
/* eslint-disable camelcase */
const { ObjectId } = require('mongodb');
const PasswordHash = require('../models/passwordHash');

async function get_password_hash(req, res) {
  try {
    const result = await PasswordHash.findOne({ _id: 'admin' });
    res.send(result);
  } catch (err) {
    console.log(err);
  }
}

async function update_password_hash(hash) {
  try {
    const result = await PasswordHash.findOneAndUpdate(
      { _id: new ObjectId('admin') },
      { hash },
      { upsert: true, new: true },
    );
    return result;
  } catch (err) {
    console.log(err);
    return -1;
  }
}

module.exports = {
  get_password_hash,
  update_password_hash,
};
