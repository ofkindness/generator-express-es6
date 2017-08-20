import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import Debug from 'debug';
import express from 'express';
<% if(options.cssPreprocessor === 'less'){ %>import lessMiddleware from 'less-middleware';
<% } %>import logger from 'morgan';
<% if(options.cssPreprocessor === 'sass'){ %>import sassMiddleware from 'node-sass-middleware';
<% } %>import path from 'path';
// import favicon from 'serve-favicon';
<% if(options.cssPreprocessor === 'stylus'){ %>import { middleware as stylusMiddleware } from 'stylus';
<% } %>
import index from './routes/index';

const app = express();
const debug = Debug('<%= slugify(appname) %>:app');
<% if(options.viewEngine !== 'none'){ %>app.set('views', path.join(__dirname, 'views'));
// view engine setup
app.set('view engine', '<%= options.viewEngine %>');<% } %>
// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(cookieParser());
<% if(options.cssPreprocessor === 'stylus'){ %>app.use(stylusMiddleware(path.join(__dirname, 'public')));<% } %><% if(options.cssPreprocessor === 'less'){ %>app.use(lessMiddleware(path.join(__dirname, 'public')));<% } %><% if(options.cssPreprocessor === 'sass'){ %>app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true,
  sourceMap: true
}));<% } %>
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
/* eslint no-unused-vars: 0 */
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
<% if(options.viewEngine !== 'none'){ %>  res.render('error');<% } else { %>  res.json(err);<% } %>
});

// Handle uncaughtException
process.on('uncaughtException', (err) => {
  debug('Caught exception: %j', err);
  process.exit(1);
});

export default app;
