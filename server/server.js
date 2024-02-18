const express = require('express');

const PORT = process.env.PORT || 3000;

const app = express();
app.set('view engine', 'pug');

// Connect to mongoDB database

// Error handling
app.use((req, res) => {
  res.status(404).render('404', { title: '404' });
});

// Start server
app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));
