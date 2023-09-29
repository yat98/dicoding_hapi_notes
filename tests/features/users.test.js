/* eslint-disable max-len */
// import notes from '../../src/models/notes.js';
import server from '../../src/app/server.js';
import pgm from 'pg';

const {Pool} = pgm;
const pool = new Pool();
let request;

const payload = {
  username: 'testjest_testing',
  password: 'secretpassword',
  fullname: 'Test Jest Testing',
};

const firstUser = async () => {
  const query = {
    text: 'SELECT * FROM users',
  };
  const result = await pool.query(query);
  return result.rows[0];
};

beforeAll(async () => {
  request = await server.start({test: true});
});

afterAll(async () => {
  await removeUsers();
  await request.stop();
});

const removeUsers = async () => {
  const query = {
    text: 'DELETE FROM users',
  };
  await pool.query(query);
};

describe('Users Feature /notes', () => {
  describe('POST /users', () => {
    it('should success add user', async () => {
      const response = await request.inject({
        method: 'POST',
        url: '/users',
        payload,
      });
      expect(response.statusCode).toBe(201);
      expect(response.result.status).toBeDefined();
      expect(response.result.message).toBeDefined();
      expect(response.result.status).toBe('success');
      expect(response.result.message).toBe('user created');
    });

    it('should reject add user when payload invalid', async () => {
      const response = await request.inject({
        method: 'POST',
        url: '/users',
        payload: {},
      });
      expect(response.statusCode).toBe(400);
      expect(response.result.status).toBeDefined();
      expect(response.result.message).toBeDefined();
      expect(response.result.status).toBe('fail');
      expect(response.result.message).toBe('\"username\" is required. \"password\" is required. \"fullname\" is required');
    });

    it('should reject add user', async () => {
      const response = await request.inject({
        method: 'POST',
        url: '/users',
        payload,
      });
      expect(response.statusCode).toBe(400);
      expect(response.result.status).toBeDefined();
      expect(response.result.message).toBeDefined();
      expect(response.result.status).toBe('fail');
      expect(response.result.message).toBe('username already exists');
    });
  });

  describe('GET /users', () => {
    it('should success get user', async () => {
      const user = await firstUser();
      const response = await request.inject({
        method: 'GET',
        url: `/users/${user.id}`,
      });
      expect(response.statusCode).toBe(200);
      expect(response.result.status).toBeDefined();
      expect(response.result.data).toBeDefined();
      expect(response.result.status).toBe('success');
      expect(response.result.data.user.id).toBeDefined();
      expect(response.result.data.user.username).toBeDefined();
      expect(response.result.data.user.fullname).toBeDefined();
    });

    it('should return 404 add user', async () => {
      const response = await request.inject({
        method: 'GET',
        url: `/users/xxxx`,
      });
      expect(response.statusCode).toBe(404);
      expect(response.result.status).toBeDefined();
      expect(response.result.message).toBeDefined();
      expect(response.result.status).toBe('fail');
      expect(response.result.message).toBe('user not found');
    });
  });
});
