/* c8 ignore next 2*/
import {nanoid} from 'nanoid';
import pg from 'pg';
import InvariantError from '../../exceptions/InvariantError.js';

class CollaborationsService {
  constructor(cacheService) {
    const {Pool} = pg;
    this._pool = new Pool();
    this._cacheService = cacheService;
  }

  async addCollaboration(noteId, userId) {
    const key = `notes:${userId}`;
    const id = `collab-${nanoid(16)}`;
    const query = {
      text: `INSERT INTO collaborations VALUES($1,$2,$3) RETURNING id`,
      values: [id, noteId, userId],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('add collaboration fail');
    }

    await this._cacheService.delete(key);
    return result.rows[0].id;
  }

  async deleteCollaboration(noteId, userId) {
    const key = `notes:${userId}`;
    const query = {
      text: `DELETE FROM collaborations 
        WHERE note_id=$1 AND user_id=$2 RETURNING id`,
      values: [noteId, userId],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('delete collaboration fail');
    }

    await this._cacheService.delete(key);
  }

  async verifyCollaboration(noteId, userId) {
    const query = {
      text: `SELECT * FROM collaborations WHERE note_id = $1 AND user_id = $2`,
      values: [noteId, userId],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('collaboration verification fail');
    }
  }
};

export default CollaborationsService;
