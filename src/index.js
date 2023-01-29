const express = require('express');
const dotenv = require( 'dotenv');
const bodyParser = require( 'body-parser');
const morgan = require( 'morgan');
const mongoose = require('mongoose');
const routes = require( './routes/index');
const passport = require('passport')
require('./config/passport');
const { errorResponse } = require( './utils/response');
dotenv.config();

const app = express();
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(passport.initialize());
app.use(passport.session());

mongoose
  .connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex:true
  })
  .then(() => {
    console.log('Successfully connected to MongoDB!');
  })
  .catch((err) => {
    console.log('Unable to connect');
    console.log(err);
  });

app.use('/api', routes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});


//Global handler
app.use('*', (req, res)=>{
  return errorResponse(res, 404, 'This endpoint does not exist');
})

