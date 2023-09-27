import ClientError from './ClientError.js';

class InvariantError extends ClientError {
  constructor(message, statusCode) {
    super(message, 400);
  }
}

export default InvariantError;
