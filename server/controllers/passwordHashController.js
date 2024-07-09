/* eslint-disable no-console */
/* eslint-disable camelcase */
const PasswordHash = require('../models/passwordHash');

async function get_password_hash(req, res) {
  try {
    const result = await PasswordHash.findOne({ type: 'admin' });
    if (result !== null) res.send(result);
    res.status(404).send('error');
  } catch (err) {
    console.log(err);
    res.status(404).send(err);
  }
}

async function update_password_hash(hash) {
  try {
    const result = await PasswordHash.findOneAndUpdate(
      { type: 'admin' },
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
