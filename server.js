var express = require('express');
var app = express();

app.use('/', express.static(__dirname + '/src', {index: 'index.html'}));

app.listen(8080, function () {
    console.log('Listening on port 8080');
});
