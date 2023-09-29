import ClientError from '../../../exceptions/ClientError.js';

/* eslint-disable max-len */
class AuthenticationHandler {
  constructor(authenticationsService, usersService, tokenManager) {
    this._authenticationsService = authenticationsService;
    this._usersService = usersService;
    this._tokenManager = tokenManager;

    this.postAuthenticationHandler = this.postAuthenticationHandler.bind(this);
    this.putAuthenticationHandler = this.putAuthenticationHandler.bind(this);
    this.deleteAuthenticationHandler = this.deleteAuthenticationHandler.bind(this);
  }

  async postAuthenticationHandler(req, h) {
    try {
      const {username, password} = req.payload;
      const id = await this._usersService
          .verifyUserCredential(username, password);
      const accessToken = await this._tokenManager.generateAccessToken({id});
      const refreshToken = await this._tokenManager.generateRefreshToken({id});
      await this._authenticationsService.addRefreshToken(refreshToken);

      return h.response({
        status: 'success',
        message: 'authentication success',
        data: {
          accessToken,
          refreshToken,
        },
      }).code(201);
    } catch (error) {
      if (error instanceof ClientError) {
        return h.response({
          status: 'fail',
          message: error.message,
        }).code(error.statusCode);
      }
      /* c8 ignore next 4 */
      return h.response({
        status: 'fail',
        message: 'server error',
      }).code(500);
    }
  }

  async putAuthenticationHandler(req, h) {
    try {
      const {refreshToken} = req.payload;
      await this._authenticationsService.verifyRefreshToken(refreshToken);
      const {id} = this._tokenManager.verifyRefreshToken(refreshToken);
      const accessToken = await this._tokenManager.generateAccessToken({id});
      return h.response({
        status: 'success',
        message: 'access token updated',
        data: {
          accessToken,
        },
      }).code(200);
    } catch (error) {
      if (error instanceof ClientError) {
        return h.response({
          status: 'fail',
          message: error.message,
        }).code(error.statusCode);
      }
      /* c8 ignore next 4 */
      return h.response({
        status: 'fail',
        message: 'server error',
      }).code(500);
    }
  }

  async deleteAuthenticationHandler(req, h) {
    try {
      const {refreshToken} = req.payload;
      await this._authenticationsService.verifyRefreshToken(refreshToken);
      await this._authenticationsService.deleteRefreshToken(refreshToken);
      return h.response({
        status: 'success',
        message: 'refresh token deleted',
      }).code(200);
    } catch (error) {
      if (error instanceof ClientError) {
        return h.response({
          status: 'fail',
          message: error.message,
        }).code(error.statusCode);
      }
      /* c8 ignore next 4 */
      return h.response({
        status: 'fail',
        message: 'server error',
      }).code(500);
    }
  }
}

export default AuthenticationHandler;
