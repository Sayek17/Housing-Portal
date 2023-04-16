var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var app = express();
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

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

// middleware setup
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// routers setup
app.use('/', indexRouter);
app.use('/admin', adminRouter);
app.use('/users', usersRouter);
app.use('/login', loginRouter);
app.use('/sign_up', sign_upRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
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
