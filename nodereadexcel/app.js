var express = require('express');
var path = require('path');

var favicon = require('serve-favicon');
var dataFormat=require('date-utils');
var utils=require('./modules/config/utils');


//var logger = require('morgan');
/**
 * Module dependencies.
 */

var debug = require('debug')('node-check:server');
var http = require('http');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const resolve = file => path.resolve(__dirname, file)


var router = require('./modules/routes/routers');
var apiRouter = require('./modules/routes/api_routers');

var app = express();
const prfs = require('@suning/node-express-prfs');
const render = require("@suning/node-express-render");
// local variables for all views
app.locals.env = process.env.NODE_ENV || 'development';

app.locals.reload = true;


// view engine setup
app.set('views', path.join(__dirname, './modules/views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, '/', 'favicon.ico')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());


//公共头尾调用
app.use(prfs({compress: true}));
var isDev = process.env.NODE_ENV == 'development';
var hostAddress=utils.domains().static;
hostAddress=isDev ?"/project/shstp":hostAddress+"min/";
var dt = new Date();
//添加时间版本号,添加合并js代码
let options={
    cdn: {
        host:hostAddress ,
        cssVersion: dt.toFormat("YYYYMMDDHH"),
        jsVersion: dt.toFormat("YYYYMMDDHH"),
        maxAge:0
   },
    layout:'./layout/layout'
};
app.use(render(options));



//app.use('/users', users);

/**
 * Listen on provided port, on all network interfaces.
 */
//判断运行环境
var gcbox=utils.domains();
var server;
if (isDev) {

    var maxAgeTime = 0;
    const serve = (path, cache) => express.static(resolve(path), {maxAge: maxAgeTime});
    app.use(serve(path.join(__dirname, './public')));

    // static assets served by webpack-dev-middleware & webpack-hot-middleware for development
    var webpack = require('webpack'),
        webpackDevConfig = require('./webpack.config.js'),
        webpackDevMiddleware = require('webpack-dev-middleware'),
        webpackHotMiddleware = require('webpack-hot-middleware');


    var compiler = webpack(webpackDevConfig);
    // handle fallback for HTML5 history API
    //app.use(require('connect-history-api-fallback')())

    // attach to the compiler & the server
    app.use(webpackDevMiddleware(compiler, {

        // public path should be the same with webpack config
        publicPath: webpackDevConfig.output.publicPath,
        noInfo: true,
        stats: {
            colors: true
        }
    }));
    app.use(webpackHotMiddleware(compiler));



    app.use('/', apiRouter);
    app.use('/', router);
    //app.get('*',function(req,res){
    //    res.end('灭有找找')
    //
    //});

    // add "reload" to express, see: https://www.npmjs.com/package/reload
    var reload = require('reload');
    server = http.createServer(app);

    reload(server, app);

}
else {
    // 设置静态文件缓存时间
    var maxAgeTime = 60 * 15;
    const serve = (path, cache) => express.static(resolve(path), {maxAge: maxAgeTime});
    app.use(serve(path.join(__dirname, './public')));

    //加载页面加载的路由
    app.use('/', apiRouter);
    app.use('/', router);

// catch 404 and forward to error handler
    app.use(function (req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    });

// error handler
    app.use(function (err, req, res, next) {
        // set locals, only providing error in development

        // render the error page
        res.status(err.status || 500);
        if(err.status==404){
            res.snRender('notfind', { title: '未找到',gcbox:gcbox});
        }
        else{
           res.snRender('error', {title:"错误页面",allKind:{},gcbox: gcbox});
        }
    });
    // error handler
    //app.use(function(err, req, res, next) {
    //    // set locals, only providing error in development
    //    res.locals.message = err.message;
    //    res.locals.error = req.app.get('env') === 'development' ? err : {};
    //
    //    // render the error page
    //    res.status(err.status || 500);
    //    res.render('error');
    //});
    server = http.createServer(app);

}
/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    debug('Listening on ' + bind);
}

//module.exports = app;
