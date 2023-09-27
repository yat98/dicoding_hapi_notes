import {nanoid} from 'nanoid';
import bcrypt from 'bcrypt';
import pkg from 'pg';
import InvariantError from '../../exceptions/InvariantError.js';
import NotFoundError from '../../exceptions/NotFoundError.js';

class UsersService {
  constructor(params) {
    const {Pool} = pkg;
    this._pool = new Pool();
  }

  async addUser({username, password, fullname}) {
    await this.verifyNewUsername(username);
    const id = `user-${nanoid(16)}`;
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = {
      text: `INSERT INTO users VALUES($1, $2, $3, $4) RETURNING id`,
      values: [id, username, hashedPassword, fullname],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('add user failed');
    }

    return result.rows[0].id;
  }

  async verifyNewUsername(username) {
    const query = {
      text: 'SELECT  username FROM users WHERE username=$1',
      values: [username],
    };
    const result = await this._pool.query(query);

    if (result.rows.length > 0) {
      throw new InvariantError('username already exists');
    }
  }

  async getUserById(userId) {
    const query = {
      text: `SELECT id, username, fullname FROM users WHERE id=$1`,
      values: [userId],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('user not found');
    }

    return result.rows[0];
  }
}

export default UsersService;
