const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const nunjucks = require('nunjucks');

const app = express();
const indexRouter = require('./routes/index');
const addressesRouter = require('./routes/addresses');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'njk');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(indexRouter);
app.use(addressesRouter);

const appViews = [
  path.join(__dirname, '/node_modules/govuk-frontend/'),
  path.join(__dirname, '/views'),
];

nunjucks.configure(appViews, {
  autoescape: true,
  express: app,
  noCache: true,
});

module.exports = app;
