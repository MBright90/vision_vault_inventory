const express = require('express');
const cors = require('cors');
const productController = require('../controllers/productController');

const productRouter = express.Router();

// productRouter.get('/', (req, res) => {
// });

// productRouter.get('/search/', productController.product_search);

productRouter.use(cors());

productRouter.get('/:id', productController.product_get);

productRouter.post('/', productController.product_post);

productRouter.put('/update_stock/:id', productController.product_update_stock);

productRouter.put('/decrement/:id', productController.product_decrement_stock);

module.exports = productRouter;
