var express = require('express');
// body-parser
var bodyParser = require('body-parser');

var app = express();

// Set port
app.set('port', process.env.PORT || 8080);

// Config body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

/* Routes to handle Parameters and Query Strings 
   will be added here 
***************************************
*                                      *
*                                      *
*                                      *
****************************************/
app.get('/dog/', function(req, res) {
   res.json({ querystring_breed: req.query.breed });
});
app.listen(app.get('port'), function() {
 console.log('Server started on localhost:' + app.get('port') + '; Press Ctrl-C to terminate.');
});