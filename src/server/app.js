/**
 * Created by falvojr on 12/10/15.
 */
'use strict';

var express = require('express')
var app = express()
var bodyParser = require('body-parser')
var compress = require('compression')
var cors = require('cors')
var favicon = require('serve-favicon')
var logger = require('morgan')
var routes

var environment = process.env.NODE_ENV
var port = process.env.PORT || 7200

app.use(bodyParser.urlencoded({extended: true}))    // parse application/x-www-form-urlencoded
app.use(bodyParser.json())                          // parse application/json
app.use(compress())                                 // compress response data with gzip
app.use(logger('combined'))                         // create "middleware" using combined format to STDOUT
app.use(favicon(__dirname + '/favicon.ico'))        // configure favicon file
app.use(cors())                                     // enable ALL CORS requests

routes = require('./routes/index')(app);

app.get('/ping', function (req, res, next) {
    console.log(req.body);
    res.send('pong');
});

switch (environment) {
    case 'production':
        console.log('** PRODUCTION **');
        console.log('serving from ' + './build/');
        process.chdir('./../../');
        app.use('/', express.static('./build/'));
        break;
    case 'stage':
    case 'build':
        console.log('** BUILD **');
        console.log('serving from ' + './build/');
        app.use('/', express.static('./build/'));
        break;
    default:
        console.log('** DEV **');
        console.log('serving from ' + './src/client/ and ./');
        app.use('/', express.static('./src/client/'));
        app.use('/', express.static('./'));
        break;
}

app.listen(port, function () {
    console.log('Express server listening on port ' + port + '(' + app.get('env') + ')');
    console.log('__dirname = ' + __dirname + '\nprocess.cwd = ' + process.cwd());
});