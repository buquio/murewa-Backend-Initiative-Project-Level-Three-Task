const {decodeToken} = require('../utils/sessionHandler');
const { errorResponse } = require('../utils/response');

const auth = async (req, res, next) => {
  if (!req.headers.authorization) {
    return errorResponse(res, 403, 'Authorization Error: Bearer token required');
  }
  try {
    const token = req.headers.authorization.split(' ')[1];

    const payload = await decodeToken({ token });
    // if (payload._id !== req.params.id) return errorResponse(res, 403, 'You do not have right to access this route'); 

    req.user = payload; 
    next();
  } catch (error) {
    return errorResponse(res, 403, 'Invalid or expired token');
  }
};

module.exports = auth;
