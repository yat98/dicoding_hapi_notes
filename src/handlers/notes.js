import {nanoid} from 'nanoid';
import notes from '../models/notes.js';

const index = (req, h) => h.response({
  status: 'success',
  data: {
    notes,
  },
});

const show = (req, h) => {
  const {id} = req.params;
  const note = notes.filter((val) => val.id === id)[0];

  if (note !== undefined) {
    return h.response({
      status: 'success',
      data: {
        note,
      },
    });
  }

  return h.response({
    status: 'fail',
    message: 'note not found',
  }).code(404);
};

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
  index,
  add,
  show,
};
