const express = require('express');

const PORT = process.env.PORT || 3000;

const app = express();
app.set('view engine', 'pug');

// Connect to mongoDB database

// Start server
app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));
