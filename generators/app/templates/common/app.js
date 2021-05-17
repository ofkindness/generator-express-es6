const cookieParser = require('cookie-parser');
const express = require('express');
const httpErrors = require('http-errors');
<% if(options.cssPreprocessor === 'less'){ %>const lessMiddleware = require('less-middleware');
<% } %><% if(options.viewEngine === 'liquid'){ %>const { Liquid } = require('liquidjs');
<% } %>const logger = require('morgan');<% if(options.viewEngine === 'njk'){ %>const nunjucks = require('nunjucks');
<% } %>
<% if(options.cssPreprocessor === 'sass'){ %>const sassMiddleware = require('node-sass-middleware');
<% } %>const path = require('path');
<% if(options.cssPreprocessor === 'stylus'){ %>const { middleware: stylusMiddleware } = require('stylus');
<% } %>
const indexRouter = require('./routes/index');

const app = express();
<% if(options.viewEngine !== 'none'){ %>
app.set('views', path.join(__dirname, 'views'));
// view engine setup
app.set('view engine', '<%= options.viewEngine %>');
<% } %><% if(options.viewEngine === 'liquid'){ %>const engine = new Liquid({
  extname: '.liquid'
});
app.engine('liquid', engine.express());
<% } %><% if(options.viewEngine === 'njk'){ %>nunjucks.configure('views', {
  autoescape: true,
  express: app
});<% } %>
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
<% if(options.cssPreprocessor === 'stylus'){ %>app.use(stylusMiddleware(path.join(__dirname, 'public')));<% } %><% if(options.cssPreprocessor === 'less'){ %>app.use(lessMiddleware(path.join(__dirname, 'public')));<% } %><% if(options.cssPreprocessor === 'sass'){ %>app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true,
  sourceMap: true
}));<% } %>
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(httpErrors(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
<% if(options.viewEngine !== 'none'){ %>  res.render('error');<% } else { %>  res.json(err);<% } %>
});

module.exports = app;
