const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();

const paymentController = require('./controllers/paymentController');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/create-order', (req, res) => {
    paymentController.createOrder(req, res);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
