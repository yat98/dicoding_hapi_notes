import server from '../../src/app/server.js';
import pgm from 'pg';

const {Pool} = pgm;
const pool = new Pool();
let request;
let refreshToken;

const payloadUser = {
  username: 'testjest_testing',
  password: 'secretpassword',
  fullname: 'Test Jest Testing',
};

const findToken = async (token) => {
  const query = {
    text: 'SELECT token FROM authentications WHERE token=$1',
    values: [token],
  };
  return await pool.query(query);
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

beforeAll(async () => {
  request = await server.start({test: true});
  await request.inject({
    method: 'POST',
    url: '/users',
    payload: payloadUser,
  });
});

afterAll(async () => {
  await request.stop();
  await removeUsers();
  await removeAuthentications();
});

describe('Authentications Feature /authentications', () => {
  describe('POST /authentications', () => {
    it('should success login', async () => {
      const {username, password} = payloadUser;
      const response = await request.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username,
          password,
        },
      });
      const token = await findToken(response.result.data.refreshToken);
      expect(response.statusCode).toBe(201);
      expect(response.result.data.accessToken).toBeDefined();
      expect(response.result.data.refreshToken).toBeDefined();
      expect(token.rows[0].token).toBe(response.result.data.refreshToken);
      refreshToken = response.result.data.refreshToken;
    });

    it('should reject login when password wrong', async () => {
      const response = await request.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: payloadUser.username,
          password: 'invalidpassword',
        },
      });
      const token = await findToken(token);
      expect(response.statusCode).toBe(401);
      expect(response.result.status).toBe('fail');
      expect(response.result.message).toBe('username or password is wrong');
    });

    it('should reject login', async () => {
      const response = await request.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'invalidusername',
          password: 'invalidpassword',
        },
      });
      const token = await findToken(token);
      expect(response.statusCode).toBe(401);
      expect(response.result.status).toBe('fail');
      expect(response.result.message).toBe('username or password is wrong');
    });
  });

  describe('PUT /authentications', () => {
    it('should success update refresh token', async () => {
      const response = await request.inject({
        method: 'PUT',
        url: '/authentications',
        payload: {
          refreshToken,
        },
      });
      expect(response.statusCode).toBe(200);
      expect(response.result.data.accessToken).toBeDefined();
    });

    it('should reject update token', async () => {
      const response = await request.inject({
        method: 'PUT',
        url: '/authentications',
        payload: {
          refreshToken: 'xxxx',
        },
      });
      expect(response.statusCode).toBe(400);
      expect(response.result.status).toBeDefined();
      expect(response.result.message).toBeDefined();
      expect(response.result.status).toBe('fail');
    });
  });

  describe('DELETE /authentications', () => {
    it('should success delete refresh token', async () => {
      const response = await request.inject({
        method: 'DELETE',
        url: '/authentications',
        payload: {
          refreshToken,
        },
      });

      expect(response.statusCode).toBe(200);
      expect(response.result.status).toBeDefined();
      expect(response.result.message).toBeDefined();
      expect(response.result.status).toBe('success');
      expect(response.result.message).toBe('refresh token deleted');
    });

    it('should reject delete token', async () => {
      const response = await request.inject({
        method: 'DELETE',
        url: '/authentications',
        payload: {
          refreshToken,
        },
      });

      expect(response.statusCode).toBe(400);
      expect(response.result.status).toBeDefined();
      expect(response.result.message).toBeDefined();
      expect(response.result.status).toBe('fail');
      expect(response.result.message).toBe('refresh token is invalid');
    });
  });
});
