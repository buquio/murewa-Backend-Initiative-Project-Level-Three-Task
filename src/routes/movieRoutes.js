const express = require('express');

const Movies = require('../controllers/movieController');
const Validation = require('../validation/movieValidation');
const Auth = require('../middlewares/auth');

const router = express.Router();

router.post('/', Auth, Validation.createMovie, Movies.createMovie);
router.get('/', Auth, Movies.getMovies);
router.get('/me', Auth, Movies.getMoviesByUserId);//getMoviesByMe
router.get('/:id', Auth, Movies.getMovieById);
router.patch('/:id', Auth, Validation.updateMovie, Movies.updateMovie);
router.delete('/:id', Auth, Movies.deleteMovie);

module.exports = router;
