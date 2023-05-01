var createError = require('http-errors');
var express = require('express');
var app = express(); // creating an instance of express() app
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var nunjucks = require('nunjucks');

//database connection
const collection = require('./model/mongodb') 

var indexRouter = require('./routes/index');
var adminRouter = require('./routes/admin');
var usersRouter = require('./routes/users');
var loginRouter = require('./routes/login');
var sign_upRouter = require('./routes/sign_up');


// view engine setup
nunjucks.configure('views', {
  autoescape: true,
  express: app
});

// template path configuration 
app.set('views', path.join(__dirname, 'views')); // path.join(path,folder) specify the location of view
// app.set('views', "D:/Project/Expressjs/Housing-Portal/Housing-Portal/views"); // path.join(path,folder) specify the location of view
app.set('view engine', 'html'); // setting the view engine to nunjuck (html) or template engine config

// middleware setup
app.use(logger('dev')); // setting the log format to colored messages
app.use(express.json());
app.use(express.urlencoded({ extended: false }));  // parse information from req objects
app.use(cookieParser()); // parsing  cookies
app.use(express.static(path.join(__dirname, 'public'))); // specifying the folder for static files


// routers setup
app.use('/', indexRouter);
app.use('/admin', adminRouter);
app.use('/users', usersRouter);
app.use('/login', loginRouter);
app.use('/sign_up', sign_upRouter);

// catch 404 and forward to error handler
app.use((req, res, next)=> {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
