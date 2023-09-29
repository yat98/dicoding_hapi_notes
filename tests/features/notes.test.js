/* eslint-disable max-len */
// import notes from '../../src/models/notes.js';
import {nanoid} from 'nanoid';
import server from '../../src/app/server.js';
import pgm from 'pg';
import {mapDBToModel} from '../../src/utils/index.js';

const {Pool} = pgm;
const pool = new Pool();
let request;
let accessToken = null;
let refreshToken = null;

const payload = {
  title: 'Test',
  tags: [
    'test',
    'lorem',
    'ipsum',
  ],
  body: 'Lorem ipsum sit dolor',
};

const payloadUser = {
  username: 'testjest_testing',
  password: 'secretpassword',
  fullname: 'Test Jest Testing',
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

const removeNotes = async () => {
  const query = {
    text: 'DELETE FROM notes',
  };
  await pool.query(query);
};

const removeUsers = async () => {
  const query = {
    text: 'DELETE FROM users',
  };
  await pool.query(query);
};

const removeAuthentications = async () => {
  const query = {
    text: 'DELETE FROM authentications',
  };
  await pool.query(query);
};

const login = async () => {
  let response = await request.inject({
    method: 'POST',
    url: '/users',
    payload: payloadUser,
  });
  const {username, password} = payloadUser;
  response = await request.inject({
    method: 'POST',
    url: '/authentications',
    payload: {
      username,
      password,
    },
  });
  accessToken = response.result.data.accessToken;
  refreshToken = response.result.data.refreshToken;
};

const getRefreshToken = async () => {
  const response = await request.inject({
    method: 'PUT',
    url: '/authentications',
    payload: {
      refreshToken,
    },
  });
  accessToken = response.result.data.accessToken;
};

beforeAll(async () => {
  request = await server.start({test: true});
  await request.inject({
    method: 'POST',
    url: '/users',
    payload,
  });
  await login();
});

afterAll(async () => {
  await request.stop();
  await removeUsers();
  await removeAuthentications();
  await removeNotes();
});

describe('Notes Feature /notes', () => {
  beforeEach(async () => {
    await getRefreshToken();
  });
  describe('POST /notes', () => {
    beforeEach(async () => {
      await getRefreshToken();
    });
    it('should success add note', async () => {
      const response = await request.inject({
        method: 'POST',
        url: '/notes',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
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
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
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
        headers: {
          'Authorization': `Bearer ${accessToken}`,
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
        headers: {
          'Authorization': `Bearer ${accessToken}`,
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
        headers: {
          'Authorization': `Bearer ${accessToken}`,
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
    beforeEach(async () => {
      await getRefreshToken();
    });
    it('should success get list notes', async () => {
      await removeNotes();
      await addNote();
      const response = await request.inject({
        method: 'GET',
        url: '/notes',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
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
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
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
    beforeEach(async () => {
      await getRefreshToken();
    });
    it('should success get detail note', async () => {
      await removeNotes();
      await addNote();
      const note = await firstNote();
      const response = await request.inject({
        method: 'GET',
        url: `/notes/${note.id}`,
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
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
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      expect(response.statusCode).toBe(404);
      expect(response.result.status).toBeDefined();
      expect(response.result.message).toBeDefined();
      expect(response.result.status).toBe('fail');
      expect(response.result.message).toBe('note not found');
    });
  });

  describe('PUT /notes/{id}', () => {
    beforeEach(async () => {
      await getRefreshToken();
    });
    it('should success update note', async () => {
      await removeNotes();
      await addNote();
      const note = await firstNote();
      const response = await request.inject({
        method: 'PUT',
        url: `/notes/${note.id}`,
        payload: payloadUpdate,
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
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
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
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
        headers: {
          'Authorization': `Bearer ${accessToken}`,
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
        headers: {
          'Authorization': `Bearer ${accessToken}`,
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
        headers: {
          'Authorization': `Bearer ${accessToken}`,
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
        headers: {
          'Authorization': `Bearer ${accessToken}`,
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
    beforeEach(async () => {
      await getRefreshToken();
    });
    it('should success delete note', async () => {
      await removeNotes();
      await addNote();
      const note = await firstNote();
      const response = await request.inject({
        method: 'DELETE',
        url: `/notes/${note.id}`,
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
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
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      expect(response.statusCode).toBe(404);
      expect(response.result.status).toBeDefined();
      expect(response.result.message).toBeDefined();
      expect(response.result.status).toBe('fail');
      expect(response.result.message).toBe('note not found');
    });
  });
});
