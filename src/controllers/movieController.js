const Movies = require('../models/movies');
const { successResponse, errorResponse } = require( '../utils/response');

const createMovie = async (req, res, next) => {
  try {
    const data = req.body;
    data.userId = req.user._id;

    const result = await Movies.create(data);    
    return successResponse(res, 201, 'Account created successfully', result);
  } catch (err) {
    return next(err);
  }
};

const getMovies = async (req, res, next) => {
  try{
    const result = await Movies.find({});

    return successResponse(res, 200, 'Movies retrieved successfully', result);
  }catch(err){
    console.log(err)
    return next(err)
}
};

/**
 * Gets all movies by the user who created the record (via the userId)
 * @param {object} req - request object
 * @param {object} res -response object
 * @param {object} next - next middleware
 * @returns {object} custom response
*/
const getMoviesByUserId = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const result = await Movies.find({userId});
    if (!result) return errorResponse(res, 404, 'Movie does not exist or was not uploaded by you'); 

    return successResponse(res, 200, 'Movies retrieved successfully', result);
  } catch (err) {
    return next(err);
  }
};

// Check for the movie by ID and if it belongs to the person who uploaded the movie
const getMovieById = async (req, res, next) => {
  try {
    const [id, userId] = [req.params.id, req.user._id];

    const result = await Movies.findOne({_id:id, userId});
    if (!result) return errorResponse(res, 404, 'Movie does not exist or was not uploaded by you'); 

    return successResponse(res, 200, `Movie ${id} retrieved successfully`, result);
  } catch (err) {
    return next(err);
  }
};

const updateMovie = async (req, res, next) => {
  try {
    const [id, data, userId] = [req.params.id, req.body, req.user._id];

    const result = await Movies.findOneAndUpdate({_id:id, userId}, data, {new: true});
    if (!result) return errorResponse(res, 403, 'Movie does not exist or was not uploaded by you'); 

    return successResponse(res, 200, `Movie updated successfully`, result);
  } catch (err) {
    return next(err);
  }
};

const deleteMovie = async (req, res, next) => {
  try {
    const [id, userId] = [req.params.id, req.user._id];

    const result = await Movies.findOneAndDelete({_id:id, userId});
    if (!result) return errorResponse(res, 404, 'Movie record does not exist or has been deleted'); 

    return successResponse(res, 200, `Movie deleted successfully`);
  } catch (err) {
    return next(err);
  }
};

module.exports = { 
    createMovie, getMovies, getMovieById, getMoviesByUserId, updateMovie, deleteMovie
};
