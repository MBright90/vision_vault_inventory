const express = require('express');
const cors = require('cors');
const productController = require('../controllers/productController');

const productRouter = express.Router();

productRouter.use(cors({ origin: 'http://localhost:8080', credentials: true }));

productRouter.get('/all', productController.get_all);

productRouter.get('/byGenre/:genreId', productController.get_by_genre);

productRouter.get('/byType/:typeId', productController.get_by_type);

productRouter.get('/bygenreandtype/:genreId/:typeId', productController.get_by_type_and_genre);

productRouter.get('/:id', productController.get_by_id);

productRouter.post('/', productController.post);

productRouter.put('/update_stock/:id', productController.update_stock);

module.exports = productRouter;
