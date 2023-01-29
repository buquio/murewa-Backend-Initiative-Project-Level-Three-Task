const express = require('express');

const Rental = require('../controllers/rentalController');
const Validation = require('../validation/rentalValidation');
const Auth = require('../middlewares/auth');

const router = express.Router();

router.post('/', Auth, Validation.createRental, Rental.createRental);
router.get('/', Auth, Rental.getRentals);
router.get('/me', Auth, Rental.getRentalsByUserId); //getRentalsByMe
router.get('/:id', Auth, Rental.getRentalById);
router.patch('/:id', Auth, Validation.updateRental, Rental.updateRental);
router.delete('/:id', Auth, Rental.deleteRental);

module.exports = router;
