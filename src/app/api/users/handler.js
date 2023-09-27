import ClientError from '../../../exceptions/ClientError.js';

class UserHandler {
  constructor(service) {
    this._service = service;

    this.postUserHandler = this.postUserHandler.bind(this);
    this.getUserByIdHandler = this.getUserByIdHandler.bind(this);
  }

  async postUserHandler(req, h) {
    try {
      const {username, password, fullname} = req.payload;
      const userId = await this._service
          .addUser({username, password, fullname});

      return h.response({
        status: 'success',
        message: 'user created',
        data: {
          userId,
        },
      }).code(201);
    } catch (error) {
      if (error instanceof ClientError) {
        return h.response({
          status: 'fail',
          message: error.message,
        }).code(error.statusCode);
      }

      return h.response({
        status: 'fail',
        message: 'server error',
      }).code(500);
    }
  }

  async getUserByIdHandler(req, h) {
    try {
      const {id} = req.params;
      const user = await this._service.getUserById(id);
      return {
        status: 'success',
        data: {
          user,
        },
      };
    } catch (error) {
      if (error instanceof ClientError) {
        return h.response({
          status: 'fail',
          message: error.message,
        }).code(error.statusCode);
      }

      return h.response({
        status: 'fail',
        message: error.message,
      }).code(500);
    }
  }
};

export default UserHandler;
