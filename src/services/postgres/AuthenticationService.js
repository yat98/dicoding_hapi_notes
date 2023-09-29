/* c8 ignore next 2 */
import pg from 'pg';
import InvariantError from '../../exceptions/InvariantError.js';

class AuthenticationService {
  constructor() {
    const {Pool} = pg;
    this._pool = new Pool();
  }

  async addRefreshToken(token) {
    const query = {
      text: `INSERT INTO authentications VALUES($1)`,
      values: [token],
    };
    await this._pool.query(query);
  }

  async verifyRefreshToken(token) {
    const query = {
      text: `SELECT * FROM authentications WHERE token=$1`,
      values: [token],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new InvariantError('refresh token is invalid');
    }
  }

  async deleteRefreshToken(token) {
    const query = {
      text: `DELETE FROM authentications WHERE token=$1`,
      values: [token],
    };
    await this._pool.query(query);
  }
}

export default AuthenticationService;
