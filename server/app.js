// DO NOT MODIFY ANYTHING HERE, THE PLACE WHERE YOU NEED TO WRITE CODE IS MARKED CLEARLY BELOW

require('dotenv').config();
const express = require('express');
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();

app.use(function (req, res, next) {
    const allowedOrigins = ['http://localhost:3000'];
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-credentials", true);
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, UPDATE");
    next();
});

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.enable('trust proxy');
app.post('/api/fetchStockData', (req, res) => {
    // YOUR CODE GOES HERE, PLEASE DO NOT EDIT ANYTHING OUTSIDE THIS FUNCTION
    const apiKey = process.env.API_KEY;
    const { stockName, date } = req.body;
    const apiUrl = `https://api.polygon.io/v1/open-close/${stockName}/${date}?adjusted=true&apiKey=${apiKey}`;

    // Optional headers if required by the API
    const headers = {
        'Content-Type': 'application/json',
    };

    // Making the Get request using Axios
    axios.get(apiUrl, { headers })
        .then(response => {
            // Handle the response data here
            res.status(200).json(response.data);;
        })
        .catch(error => {
            // Handle errors here
            if (error.response && error.response.status === 500) {
                res.status(500).json({ error: 'An error occurred while fetching stock data.' });
            }
            else {
                let errorMessage = error.response.statusText;
                let statusCode = error.response.status;
                res.status(statusCode).json({ error: errorMessage });
            }
        });
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening on port ${port}`));