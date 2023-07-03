const express = require('express');
const app = express();
const path = require("path");
const PORT = 3000;
const { default: axios } = require('axios');
const cors = require('cors');
app.use(cors({
  origin: '*',
  credential: 'true'
}));

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, '../client/build')));

app.get('/', function(req,res) {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

app.get('/v1/price', (req, res) => {
    axios.get(
        'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd'
    ).then((response) => {
        res.send(response.data);
    });
});

app.listen(PORT);