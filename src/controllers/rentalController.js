const Rentals = require('../models/rentals');
const { successResponse, errorResponse } = require( '../utils/response');

const createRental = async (req, res, next) => {
  try {
    const data = req.body;
    data.userId = req.user._id;

    const result = await Rentals.create(data);    
    return successResponse(res, 201, 'Rental created successfully', result);
  } catch (err) {
    return next(err);
  }
};


const getRentals = async (req, res, next) => {
  try {
    const result = await Rentals.find({});

    return successResponse(res, 200, 'Rentals retrieved successfully', result);
  } catch (err) {
    return next(err);
  }
};

/**
 * Gets all rentals by the user who created the record (via the userId)
 * @param {object} req - request object
 * @param {object} res -response object
 * @param {object} next - next middleware
 * @returns {object} custom response
*/


const getRentalsByUserId = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const result = await Rentals.find({userId});
    if (!result) return errorResponse(res, 404, 'Movie does not exist or was not uploaded by you'); 

    return successResponse(res, 200, 'Rentals retrieved successfully', result);
  } catch (err) {
    return next(err);
  }
};

// Check for the movie by ID and if it belongs to the person who uploaded the movie
const getRentalById = async (req, res, next) => {
  try {
    const [id, userId] = [req.params.id, req.user._id];

    const result = await Rentals.findOne({_id:id, userId});
    if (!result) return errorResponse(res, 404, 'Movie does not exist or was not uploaded by you'); 

    return successResponse(res, 200, `Rentals ${id} retrieved successfully`, result);
  } catch (err) {
    return next(err);
  }
};

const updateRental = async (req, res, next) => {
  try {
    const [id, data, userId] = [req.params.id, req.body, req.user._id];

    const result = await Rentals.findOneAndUpdate({_id:id, userId}, data, {new: true});
    if (!result) return errorResponse(res, 403, 'Rental does not exist or was not uploaded by you'); 

    return successResponse(res, 200, `Rental updated successfully`, result);
  } catch (err) {
    return next(err);
  }
};

const deleteRental = async (req, res, next) => {
  try {
    const [id, userId] = [req.params.id, req.user._id];

    const result = await Rentals.findOneAndDelete({_id:id, userId});
    if (!result) return errorResponse(res, 404, 'Rental record does not exist or has been deleted'); 

    return successResponse(res, 200, `Rental deleted successfully`);
  } catch (err) {
    return next(err);
  }
};

module.exports = { 
    createRental, getRentals, getRentalsByUserId, getRentalById, updateRental, deleteRental
};
