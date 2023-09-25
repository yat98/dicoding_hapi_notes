/* eslint-disable max-len */
// import notes from '../../src/models/notes.js';
import {nanoid} from 'nanoid';
import server from '../../src/app/server.js';
import pgm from 'pg';
import {mapDBToModel} from '../../src/utils/index.js';

const {Pool} = pgm;
const pool = new Pool();
let request;

const payload = {
  title: 'Test',
  tags: [
    'test',
    'lorem',
    'ipsum',
  ],
  body: 'Lorem ipsum sit dolor',
};

const payloadUpdate = {
  title: 'Test Update',
  tags: [
    'test update',
    'lorem update',
    'ipsum update',
  ],
  body: 'Lorem ipsum sit dolor Updated.',
};

// const addNote = () => {
//   const id = nanoid(16);
//   const createdAt = new Date().toISOString();
//   const updatedAt = createdAt;
//   notes.push({
//     id,
//     createdAt,
//     updatedAt,
//     ...payload,
//   });
// };

const addNote = async () => {
  const id = nanoid(16);
  const createdAt = new Date().toISOString();
  const updatedAt = createdAt;
  const {title, body, tags} = payload;
  const query = {
    text: 'INSERT INTO notes VALUES($1,$2,$3,$4,$5,$6) RETURNING id',
    values: [id, title, body, tags, createdAt, updatedAt],
  };
  await pool.query(query);
};

// const findNoteId = (id) => {
//   return notes.find((note) => note.id === id);
// };

const findNoteId = async (id) => {
  const query = {
    text: 'SELECT * FROM notes WHERE id=$1',
    values: [id],
  };
  const result = await pool.query(query);
  return result.rows.map(mapDBToModel);
};

const firstNote = async () => {
  const query = {
    text: 'SELECT * FROM notes',
  };
  const result = await pool.query(query);
  return result.rows.map(mapDBToModel)[0];
};

// const removeNotes = () => {
//   while (notes.length > 0) {
//     notes.pop();
//   }
// };

const removeNotes = async () => {
  const query = {
    text: 'DELETE FROM notes',
  };
  await pool.query(query);
};

beforeAll(async () => {
  request = await server.init();
});

afterAll(async () => {
  await request.stop();
});
describe('Notes Feature /notes', () => {
  describe('POST /notes', () => {
    it('should success add note', async () => {
      const response = await request.inject({
        method: 'POST',
        url: '/notes',
        payload,
      });
      const notes = await findNoteId(response.result.data.noteId);
      const {title, tags, body} = notes[0];
      expect(response.statusCode).toBe(201);
      expect(response.result.status).toBeDefined();
      expect(response.result.message).toBeDefined();
      expect(response.result.data.noteId).toBeDefined();
      expect(response.result.status).toBe('success');
      expect(response.result.message).toBe('success add note');
      expect(title).toBe(payload.title);
      expect(tags).toEqual(payload.tags);
      expect(body).toBe(payload.body);
    });

    it('should return fail when all payload is empty', async () => {
      const response = await request.inject({
        method: 'POST',
        url: '/notes',
        payload: {},
      });

      expect(response.result.status).toBeDefined();
      expect(response.result.message).toBeDefined();
      expect(response.statusCode).toBe(400);
      expect(response.result.status).toBe('fail');
      expect(response.result.message).toBe('"title" is required. "tags" is required. "body" is required');
    });

    it('should return fail when title payload is empty', async () => {
      const response = await request.inject({
        method: 'POST',
        url: '/notes',
        payload: {
          tags: payload.tags,
          body: payload.body,
        },
      });

      expect(response.result.status).toBeDefined();
      expect(response.result.message).toBeDefined();
      expect(response.statusCode).toBe(400);
      expect(response.result.status).toBe('fail');
      expect(response.result.message).toBe('"title" is required');
    });

    it('should return fail when tags payload is empty', async () => {
      const response = await request.inject({
        method: 'POST',
        url: '/notes',
        payload: {
          title: payload.title,
          body: payload.body,
        },
      });

      expect(response.result.status).toBeDefined();
      expect(response.result.message).toBeDefined();
      expect(response.statusCode).toBe(400);
      expect(response.result.status).toBe('fail');
      expect(response.result.message).toBe('"tags" is required');
    });

    it('should return fail when body payload is empty', async () => {
      const response = await request.inject({
        method: 'POST',
        url: '/notes',
        payload: {
          title: payload.title,
          tags: payload.tags,
        },
      });

      expect(response.result.status).toBeDefined();
      expect(response.result.message).toBeDefined();
      expect(response.statusCode).toBe(400);
      expect(response.result.status).toBe('fail');
      expect(response.result.message).toBe('"body" is required');
    });
  });

  describe('GET /notes', () => {
    it('should success get list notes', async () => {
      await removeNotes();
      await addNote();
      const response = await request.inject({
        method: 'GET',
        url: '/notes',
      });

      expect(response.statusCode).toBe(200);
      expect(response.result.status).toBeDefined();
      expect(response.result.data).toBeDefined();
      expect(response.result.data.notes).toBeDefined();
      expect(response.result.status).toBe('success');
      expect(response.result.data.notes[0].title).toBe(payload.title);
      expect(response.result.data.notes[0].tags).toEqual(payload.tags);
      expect(response.result.data.notes[0].body).toBe(payload.body);
    });

    it('should success get to empty list', async () => {
      await removeNotes();
      const response = await request.inject({
        method: 'GET',
        url: '/notes',
      });

      expect(response.statusCode).toBe(200);
      expect(response.result.status).toBeDefined();
      expect(response.result.data).toBeDefined();
      expect(response.result.data.notes).toBeDefined();
      expect(response.result.status).toBe('success');
      expect(response.result.data.notes).toEqual([]);
    });
  });

  describe('GET /notes/{id}', () => {
    it('should success get detail note', async () => {
      await removeNotes();
      await addNote();
      const note = await firstNote();
      const response = await request.inject({
        method: 'GET',
        url: `/notes/${note.id}`,
      });

      expect(response.statusCode).toBe(200);
      expect(response.result.status).toBeDefined();
      expect(response.result.data).toBeDefined();
      expect(response.result.data.note).toBeDefined();
      expect(response.result.status).toBe('success');
      expect(response.result.data.note.title).toBe(payload.title);
      expect(response.result.data.note.tags).toEqual(payload.tags);
      expect(response.result.data.note.body).toBe(payload.body);
    });

    it('should return 404 if note is not exists', async () => {
      await removeNotes();
      const response = await request.inject({
        method: 'GET',
        url: '/notes/invalidid',
      });

      expect(response.statusCode).toBe(404);
      expect(response.result.status).toBeDefined();
      expect(response.result.message).toBeDefined();
      expect(response.result.status).toBe('fail');
      expect(response.result.message).toBe('note not found');
    });
  });

  describe('PUT /notes/{id}', () => {
    it('should success update note', async () => {
      await removeNotes();
      await addNote();
      const note = await firstNote();
      const response = await request.inject({
        method: 'PUT',
        url: `/notes/${note.id}`,
        payload: payloadUpdate,
      });
      const notes = await findNoteId(note.id);
      const {title, tags, body} = notes[0];

      expect(response.statusCode).toBe(200);
      expect(response.result.status).toBeDefined();
      expect(response.result.message).toBeDefined();
      expect(response.result.status).toBe('success');
      expect(response.result.message).toBe('success update note');
      expect(title).toBe(payloadUpdate.title);
      expect(tags).toEqual(payloadUpdate.tags);
      expect(body).toBe(payloadUpdate.body);
    });

    it('should return fail when all payload is empty', async () => {
      const note = await firstNote();
      const response = await request.inject({
        method: 'PUT',
        url: `/notes/${note.id}`,
        payload: {},
      });

      expect(response.result.status).toBeDefined();
      expect(response.result.message).toBeDefined();
      expect(response.statusCode).toBe(400);
      expect(response.result.status).toBe('fail');
      expect(response.result.message).toBe('"title" is required. "tags" is required. "body" is required');
    });

    it('should return fail when title payload is empty', async () => {
      const note = await firstNote();
      const response = await request.inject({
        method: 'PUT',
        url: `/notes/${note.id}`,
        payload: {
          tags: payloadUpdate.tags,
          body: payloadUpdate.body,
        },
      });

      expect(response.result.status).toBeDefined();
      expect(response.result.message).toBeDefined();
      expect(response.statusCode).toBe(400);
      expect(response.result.status).toBe('fail');
      expect(response.result.message).toBe('"title" is required');
    });

    it('should return fail when tags payload is empty', async () => {
      const note = await firstNote();
      const response = await request.inject({
        method: 'PUT',
        url: `/notes/${note.id}`,
        payload: {
          body: payloadUpdate.body,
          title: payload.title,
        },
      });

      expect(response.result.status).toBeDefined();
      expect(response.result.message).toBeDefined();
      expect(response.statusCode).toBe(400);
      expect(response.result.status).toBe('fail');
      expect(response.result.message).toBe('"tags" is required');
    });

    it('should return fail when body payload is empty', async () => {
      const note = await firstNote();
      const response = await request.inject({
        method: 'PUT',
        url: `/notes/${note.id}`,
        payload: {
          tags: payloadUpdate.tags,
          title: payload.title,
        },
      });

      expect(response.result.status).toBeDefined();
      expect(response.result.message).toBeDefined();
      expect(response.statusCode).toBe(400);
      expect(response.result.status).toBe('fail');
      expect(response.result.message).toBe('"body" is required');
    });

    it('should return 404 when note is not exists', async () => {
      const response = await request.inject({
        method: 'PUT',
        url: `/notes/invalidid`,
        payload: {
          title: payloadUpdate.title,
          tags: payloadUpdate.tags,
          body: payloadUpdate.body,
        },
      });

      expect(response.result.status).toBeDefined();
      expect(response.result.message).toBeDefined();
      expect(response.statusCode).toBe(404);
      expect(response.result.status).toBe('fail');
      expect(response.result.message).toBe('note not found');
    });
  });

  describe('DELETE /notes/{id}', () => {
    it('should success delete note', async () => {
      await removeNotes();
      await addNote();
      const note = await firstNote();
      const response = await request.inject({
        method: 'DELETE',
        url: `/notes/${note.id}`,
      });

      expect(response.statusCode).toBe(200);
      expect(response.result.status).toBeDefined();
      expect(response.result.message).toBeDefined();
      expect(response.result.status).toBe('success');
      expect(response.result.message).toBe('success delete note');

      await removeNotes();
    });

    it('should return 404 when note is not exists', async () => {
      const response = await request.inject({
        method: 'DELETE',
        url: `/notes/invalidid`,
      });

      expect(response.statusCode).toBe(404);
      expect(response.result.status).toBeDefined();
      expect(response.result.message).toBeDefined();
      expect(response.result.status).toBe('fail');
      expect(response.result.message).toBe('note not found');
    });
  });
});
