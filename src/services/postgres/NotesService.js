/* eslint-disable max-len */
/* c8 ignore next 2 */
import {nanoid} from 'nanoid';
import pkg from 'pg';
import {mapDBToModel} from '../../utils/index.js';
import NotFoundError from '../../exceptions/NotFoundError.js';
import AuthorizationError from '../../exceptions/AuthorizationError.js';

class NotesService {
  constructor(collaborationService, cacheService) {
    const {Pool} = pkg;
    this._pool = new Pool();
    this._collaborationService = collaborationService;
    this._cacheService = cacheService;
  }

  async addNote({title, body, tags, owner}) {
    const key = `notes:${owner}`;
    const id = nanoid(16);
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;
    const query = {
      text: 'INSERT INTO notes VALUES($1,$2,$3,$4,$5,$6,$7) RETURNING id',
      values: [id, title, body, tags, createdAt, updatedAt, owner],
    };
    const result = await this._pool.query(query);
    await this._cacheService.delete(key);

    return result.rows[0].id;
  }

  async getNote(owner) {
    const key = `notes:${owner}`;
    try {
      const result = await this._cacheService.get(key);
      return JSON.parse(result);
    } catch (error) {
      const query = {
        text: `SELECT notes.* FROM notes
        LEFT JOIN collaborations ON collaborations.note_id = notes.id
        WHERE notes.owner = $1 OR collaborations.user_id = $1
        GROUP BY notes.id`,
        values: [owner],
      };
      const result = await this._pool.query(query);
      const mappedResult = result.rows.map(mapDBToModel);

      await this._cacheService.set(key, JSON.stringify(mappedResult));

      return mappedResult;
    }
  }

  async getNoteById(id) {
    const query = {
      text: `SELECT notes.*, users.username
      FROM notes
      LEFT JOIN users ON users.id = notes.owner
      WHERE notes.id = $1`,
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('note not found');
    }
    return result.rows.map(mapDBToModel)[0];
  }

  async editNoteById(id, {title, body, tags}) {
    const updatedAt = new Date().toISOString();
    const query = {
      text: 'UPDATE notes SET title = $1, body = $2, tags = $3, updated_at = $4 WHERE id = $5 RETURNING id, owner',
      values: [title, body, tags, updatedAt, id],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('note not found');
    }

    const {owner} = result.rows[0];
    const key = `notes:${owner}`;
    await this._cacheService.delete(key);
  }

  async deleteNoteById(id) {
    const query = {
      text: 'DELETE FROM notes WHERE id = $1 RETURNING id, owner',
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('note not found');
    }

    const {owner} = result.rows[0];
    const key = `notes:${owner}`;
    await this._cacheService.delete(key);
  }

  async verifyNoteOwner(id, owner) {
    const query = {
      text: `SELECT * FROM notes WHERE id=$1`,
      values: [id],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('note not found');
    }

    const note = result.rows[0];
    if (note.owner !== owner) {
      throw new AuthorizationError('unauthorized');
    }

    return note;
  }

  async verifyNoteAccess(noteId, userId) {
    try {
      await this.verifyNoteOwner(noteId, userId);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }

      try {
        await this._collaborationService.verifyCollaboration(noteId, userId);
      } catch {
        throw error;
      }
    }
  }
}

export default NotesService;
