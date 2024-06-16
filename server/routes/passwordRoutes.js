const express = require('express');
const cors = require('cors');
const passwordHashController = require('../controllers/passwordHashController');

const router = express.Router();

router.use(cors({ origin: 'http://localhost:8080', credentials: true }));

router.get('/', passwordHashController.compare_password_hash);

module.exports = router;
