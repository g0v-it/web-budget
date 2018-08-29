var express = require('express');
var app = express();


app.use(express.static(__dirname + '/dist'));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/dist/index.html');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, function () {
    console.log('App listening on port ' + PORT);
});