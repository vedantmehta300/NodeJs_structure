/**
 * System and 3rd party libs
 */
const config = require('./configuration/config');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose')

/**
 * Required Services
 */
let logger = require('./services/logger');

let app = express();
let dbURL = config.server.mongoDb_connection_URL || 'mongodb://127.0.0.1:27017/chatbotV2';
//CORS

app.use(
    cors({
        origin: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        credentials: true,
    }),
);
app.use(logger.morgan);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

/**
 * Import and Register Routes
 */
let api=require('./components/routes');
const {checkMediaAndCreateFolder} = require("./helper/common.helper");



app.use('/api',api)
app.use(express.static('public'));
app.use(express.static('media'));
app.use(express.static(path.join(__dirname, '../media')));
/**
 * Catch 404 routes
 */
app.use(function(req, res, next) {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/**
 * Error Handler
 */
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    res.status(err.status || 500);
    res.json(err);
});

/**
 * Mongoose Configuration
 */
mongoose.Promise = global.Promise;

mongoose.connection.on('connected', async () => {
    logger.log.info('DATABASE - Connected');
    checkMediaAndCreateFolder();
});

mongoose.connection.on('error', err => {
    logger.log.error('DATABASE - Error:' + err);
});

mongoose.connection.on('disconnected', () => {
    logger.log.warn('DATABASE - disconnected  Retrying....');
});

let connectDb = function() {
    const dbOptions = {
        poolSize: 5,
        reconnectTries: Number.MAX_SAFE_INTEGER,
        reconnectInterval: 500,
        useNewUrlParser: true,
        useFindAndModify: false,
    };
    mongoose.connect(dbURL, dbOptions).catch(err => {
        logger.log.fatal('DATABASE - Error:' + err);
    });
};

connectDb();
module.exports = {
    app:app
};
