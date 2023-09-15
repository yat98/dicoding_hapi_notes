import {nanoid} from 'nanoid';
import notes from '../models/notes.js';

const add = (req, h) => {
  const {title, tags, body} = req.payload;
  const id = nanoid(16);
  const createdAt = new Date().toISOString();
  const updatedAt = createdAt;

  notes.push({
    id,
    title,
    tags,
    body,
    createdAt,
    updatedAt,
  });

  return h.response({
    status: 'success',
    message: 'success add note',
    data: {
      noteId: id,
    },
  }).code(201);
};

export default {
  add,
};
