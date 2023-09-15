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

const update = (req, h) => {
  const {id} = req.params;
  const {title, tags, body} = req.payload;
  const updatedAt = new Date().toISOString();
  const noteIndex = notes.findIndex((val) => val.id === id);

  if (noteIndex !== -1) {
    notes[noteIndex] = {
      ...notes[noteIndex],
      title,
      tags,
      body,
      updatedAt,
    };
    return h.response({
      status: 'success',
      message: 'success update note',
    }).code(200);
  }

  return h.response({
    status: 'fail',
    message: 'note not found',
  }).code(404);
};

const destroy = (req, h) => {
  const {id} = req.params;
  const noteIndex = notes.findIndex((val) => val.id === id);

  if (noteIndex !== -1) {
    notes.splice(noteIndex, 1);
    return h.response({
      status: 'success',
      message: 'success delete note',
    }).code(200);
  }

  return h.response({
    status: 'fail',
    message: 'note not found',
  }).code(404);
};

export default {
  index,
  add,
  show,
  update,
  destroy,
};
