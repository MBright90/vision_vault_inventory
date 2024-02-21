const express = require('express');
const productController = require('../controllers/productController');

const productRouter = express.Router();

// productRouter.get('/', (req, res) => {
// });

productRouter.post('/', productController.product_put);

module.exports = productRouter;
