const express = require('express');
const cors = require('cors');
const typeController = require('../controllers/typeController');

const typeRouter = express.Router();

typeRouter.use(cors({ origin: 'http://localhost:8080', credentials: true }));

typeRouter.get('/', typeController.get_all);

module.exports = typeRouter;
