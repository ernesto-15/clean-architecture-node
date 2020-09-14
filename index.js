const express = require('express');
const bodyParser = require('body-parser')
const movieApi = require('./routes/movie')  
const { config } = require('./config/index');
const {logError, errorHandler} = require('./utils/middlewares/errorHandler')

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())


movieApi(app)

//log errors
app.use(logError,errorHandler)
// app.use(errorHandler)

app.listen(config.port, (err) => {
  if (err) return console.log(err);
  console.log(`Listening to port ${config.port}`);
});
