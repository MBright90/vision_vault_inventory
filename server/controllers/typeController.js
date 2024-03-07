/* eslint-disable camelcase */
const Type = require('../models/type');

async function get_id(type) {
  // find type and create if not found
  try {
    const lowerType = type.toLowerCase();
    const result = await Type.findOneAndUpdate(
      { name: lowerType },
      { name: lowerType },
      { upsert: true },
    );
    return result;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err); // log error
    throw err;
  }
}

module.exports = {
  get_id,
};
