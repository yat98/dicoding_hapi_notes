import ClientError from './ClientError.js';

class NotFoundError extends ClientError {
  constructor(message, statusCode) {
    super(message, 404);
  }
}

export default NotFoundError;
