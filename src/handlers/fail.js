const failHandler = (req, h, err) => {
  if (err.isJoi && Array.isArray(err.details) && err.details.length > 0) {
    return h.response({
      status: 'fail',
      message: err.output.payload.message,
    }).code(400).takeover();
  }
};

export default failHandler;
