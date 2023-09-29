import Jwt from '@hapi/jwt';
import token from '../../config/token.js';
import InvariantError from '../../exceptions/InvariantError.js';

const TokenManager = {
  generateAccessToken: (payload) =>
    Jwt.token.generate(payload, token.accessTokenKey),
  generateRefreshToken: (payload) =>
    Jwt.token.generate(payload, token.refreshTokenKey),
  verifyRefreshToken: (refreshToken) => {
    try {
      const artifacts = Jwt.token.decode(refreshToken);
      Jwt.token.verifySignature(artifacts, token.refreshTokenKey);
      const {payload} = artifacts.decoded;
      return payload;
    /* c8 ignore next 3 */
    } catch (error) {
      throw new InvariantError('refresh token is invalid');
    }
  },
};

export default TokenManager;
