/* eslint-disable no-console */
/* eslint-disable camelcase */
const Type = require('../models/type');

async function get_all(req, res) {
  try {
    const result = await Type.find().sort({ name: 1 });
    res.send(result);
  } catch (err) {
    console.log(err); // log error
    res.status(500).send(err);
  }
}

async function get_id(type, session = null) { // THIS WORKED
  // find type and create if not found
  try {
    const lowerType = type.toLowerCase();

    const options = { upsert: true, new: true };
    if (session) options.session = session;

    const result = await Type.findOneAndUpdate(
      { name: lowerType },
      { name: lowerType },
      options,
    );
    return result._id;
  } catch (err) {
    console.log(err); // log error
    return null;
  }
}

async function add_product(typeId, productId, session = null) {
  const result = await Type.updateOne(
    { _id: typeId },
    { $push: { products: productId } },
    { session },
  );
  return result;
}

module.exports = {
  get_all,
  get_id,
  add_product,
};
