const addNotes = (req, h) => {
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

  const isSuccess = notes.find((note) => note.id === id);

  if (isSuccess) {
    return h.response({
      status: 'success',
      message: 'success add note',
      data: {
        noteId: id,
      },
    }).code(201);
  }

  return h.response({
    status: 'fail',
    message: 'failed add note',
  }).code(500);
};

export default {
  addNotes,
};
