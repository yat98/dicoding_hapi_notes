/* eslint-disable max-len */
import {nanoid} from 'nanoid';
import server from '../../src/app/server.js';
import pgm from 'pg';
import {mapDBToModel} from '../../src/utils/index.js';

const {Pool} = pgm;
const pool = new Pool();
let request;
let accessToken = null;
let refreshToken = null;

const payloadNote = {
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

const payloadUserTwo = {
  username: 'testjest_testing_2',
  password: 'secretpassword',
  fullname: 'Test Jest Testing 2',
};

const findUser = async (username) => {
  const query = {
    text: 'SELECT * FROM users WHERE username=$1',
    values: [username],
  };
  const result = await pool.query(query);
  return result.rows[0];
};

const removeUsers = async () => {
  const query = {
    text: 'DELETE FROM users',
  };
  await pool.query(query);
};

const login = async () => {
  let response = await request.inject({
    method: 'POST',
    url: '/users',
    payload: payloadUserTwo,
  });
  response = await request.inject({
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

const addNote = async () => {
  const id = nanoid(16);
  const createdAt = new Date().toISOString();
  const updatedAt = createdAt;
  const {title, body, tags} = payloadNote;

  const user = await findUser(payloadUser.username);
  const query = {
    text: 'INSERT INTO notes VALUES($1,$2,$3,$4,$5,$6,$7) RETURNING id',
    values: [id, title, body, tags, createdAt, updatedAt, user.id],
  };
  await pool.query(query);
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

const removeAuthentications = async () => {
  const query = {
    text: 'DELETE FROM authentications',
  };
  await pool.query(query);
};

const removeCollaborations = async () => {
  const query = {
    text: 'DELETE FROM collaborations',
  };
  await pool.query(query);
};

beforeAll(async () => {
  request = await server.start({test: true});
  await request.inject({
    method: 'POST',
    url: '/users',
    payload: {
      username: payloadUser.username,
      password: payloadUser.password,
    },
  });
  await login();
  await addNote();
});

afterAll(async () => {
  await request.stop();
  await removeCollaborations();
  await removeNotes();
  await removeAuthentications();
  await removeUsers();
});


describe('Collaboration Feature /collaborations', () => {
  beforeEach(async () => {
    await getRefreshToken();
  });
  describe('POST /notes', () => {
    beforeEach(async () => {
      await getRefreshToken();
    });
    it('should success add collaboration', async () => {
      const note = await firstNote();
      const user = await findUser(payloadUserTwo.username);
      const response = await request.inject({
        method: 'POST',
        url: '/collaborations',
        payload: {
          noteId: note.id,
          userId: user.id,
        },
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      expect(response.statusCode).toBe(201);
      expect(response.result.status).toBeDefined();
      expect(response.result.message).toBeDefined();
      expect(response.result.data.collaborationId).toBeDefined();
      expect(response.result.status).toBe('success');
      expect(response.result.message).toBe('success add collaboration');
    });

    it('should return 403 add collaboration', async () => {
      const note = await firstNote();
      const user = await findUser(payloadUserTwo.username);
      const {username, password} = payloadUserTwo;
      let response = await request.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username,
          password,
        },
      });
      response = await request.inject({
        method: 'POST',
        url: '/collaborations',
        payload: {
          noteId: note.id,
          userId: user.id,
        },
        headers: {
          'Authorization': `Bearer ${response.result.data.accessToken}`,
        },
      });
      expect(response.statusCode).toBe(403);
      expect(response.result.status).toBeDefined();
      expect(response.result.message).toBeDefined();
      expect(response.result.status).toBe('fail');
      expect(response.result.message).toBe('unauthorized');
    });

    it('should reject add collaboration', async () => {
      const response = await request.inject({
        method: 'POST',
        url: '/collaborations',
        payload: {},
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      expect(response.statusCode).toBe(400);
      expect(response.result.status).toBeDefined();
      expect(response.result.message).toBeDefined();
      expect(response.result.status).toBe('fail');
      expect(response.result.message).toBe('"noteId" is required. "userId" is required');
    });
  });

  describe('DELETE /notes', () => {
    beforeEach(async () => {
      await getRefreshToken();
    });
    it('should success delete collaboration', async () => {
      const note = await firstNote();
      const user = await findUser(payloadUserTwo.username);
      const response = await request.inject({
        method: 'DELETE',
        url: '/collaborations',
        payload: {
          noteId: note.id,
          userId: user.id,
        },
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      expect(response.statusCode).toBe(200);
      expect(response.result.status).toBeDefined();
      expect(response.result.message).toBeDefined();
      expect(response.result.status).toBe('success');
      expect(response.result.message).toBe('success delete collaboration');
    });

    it('should return 403 delete collaboration', async () => {
      const note = await firstNote();
      const user = await findUser(payloadUserTwo.username);
      const {username, password} = payloadUserTwo;
      let response = await request.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username,
          password,
        },
      });
      response = await request.inject({
        method: 'POST',
        url: '/collaborations',
        payload: {
          noteId: note.id,
          userId: user.id,
        },
        headers: {
          'Authorization': `Bearer ${response.result.data.accessToken}`,
        },
      });
      expect(response.statusCode).toBe(403);
      expect(response.result.status).toBeDefined();
      expect(response.result.message).toBeDefined();
      expect(response.result.status).toBe('fail');
      expect(response.result.message).toBe('unauthorized');
    });

    it('should return 400 delete collaboration', async () => {
      const note = await firstNote();
      const user = await findUser(payloadUserTwo.username);
      const response = await request.inject({
        method: 'DELETE',
        url: '/collaborations',
        payload: {
          noteId: note.id,
          userId: user.id,
        },
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      expect(response.statusCode).toBe(400);
      expect(response.result.status).toBeDefined();
      expect(response.result.message).toBeDefined();
      expect(response.result.status).toBe('fail');
      expect(response.result.message).toBe('delete collaboration fail');
    });

    it('should return 404 delete collaboration', async () => {
      const response = await request.inject({
        method: 'DELETE',
        url: '/collaborations',
        payload: {
          noteId: 'invalidid',
          userId: 'invaliduser',
        },
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
