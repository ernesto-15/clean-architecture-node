const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const movieApi = require('./routes/movie');
const userMovieApi = require('./routes/userMovie');
const authApi = require('./routes/auth');
const { config } = require('./config/index');
const {
  logError,
  errorHandler,
  wrapError,
} = require('./utils/middlewares/errorHandler');
const notFoundHandler = require('./utils/middlewares/notFoundHandler');

const app = express();

//cors
app.use(cors());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

//Route
movieApi(app);
userMovieApi(app);
authApi(app);

//Catch 404 error
app.use(notFoundHandler);

//log errors - Middleware
app.use(logError, wrapError, errorHandler);
// app.use(errorHandler)

app.listen(config.port, (err) => {
  if (err) return console.log(err);
  console.log(`Listening to port ${config.port}`);
});
