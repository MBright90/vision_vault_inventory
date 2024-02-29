const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const productRouter = require('./routes/productRoutes');

const PORT = process.env.PORT || 3000;

const app = express();
app.set('view engine', 'pug');

// Connect to mongoDB database
mongoose.set('strictQuery', false);
const mongoDB = `mongodb+srv://${process.env.DB_UN}:${process.env.DB_PW}@development.74so7kt.mongodb.net/?retryWrites=true&w=majority`;

async function main() {
  mongoose.connect(mongoDB);
}

// Middleware
app.use(cors());

// Routers
app.get('/', (req, res) => {
  console.log('frontend connected');
  const requestData = {
    method: req.method,
    headers: req.headers,
  };
  res.json(requestData);
});

app.use('/product/', productRouter);

// Error handling
app.use((req, res) => {
  console.log(req);
  res.status(404).render('404', { title: '404' });
});

// Start server
main()
  .then(app.listen(PORT, () => console.log(`Listening on port: ${PORT}`)))
  .catch((err) => console.log(err));
