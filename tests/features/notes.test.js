/* eslint-disable max-len */
import server from '../../src/app/server.js';
import notes from '../../src/models/notes.js';

let request;

const findNoteId = (id) => {
  return notes.find((note) => note.id === id);
};

beforeAll(async () => {
  request = await server.init();
});

afterAll(async () => {
  await request.stop();
});

describe('POST /notes', () => {
  const payload = {
    title: 'Test',
    tags: [
      'test',
      'lorem',
      'ipsum',
    ],
    body: 'Lorem ipsum sit dolor',
  };

  it('should success add note', async () => {
    const response = await request.inject({
      method: 'POST',
      url: '/notes',
      payload,
    });

    const {title, tags, body} = findNoteId(response.result.data.noteId);

    expect(response.statusCode).toBe(201);
    expect(response.result.status).toBeDefined();
    expect(response.result.message).toBeDefined();
    expect(response.result.data.noteId).toBeDefined();
    expect(response.result.status).toBe('success');
    expect(response.result.message).toBe('success add note');
    expect(title).toBe('Test');
    expect(tags).toEqual(tags);
    expect(body).toBe(body);
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
