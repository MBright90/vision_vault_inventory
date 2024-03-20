const express = require('express');
const cors = require('cors');
const genreController = require('../controllers/genreController');

const router = express.Router();

router.use(cors({ origin: 'http://localhost:8080', credentials: true }));

router.get('/', genreController.get_all);

module.exports = router;
