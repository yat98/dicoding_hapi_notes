import {nanoid} from 'nanoid';

class NotesService {
  constructor(notes) {
    this._notes = notes;
  }

  addNote({title, body, tags}) {
    const id = nanoid(16);
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    this._notes.push({
      id,
      title,
      tags,
      body,
      createdAt,
      updatedAt,
    });

    return id;
  }

  getNote() {
    return this._notes;
  }

  getNoteById(id) {
    const note = this._notes.filter((val) => val.id === id)[0];
    if (!note) {
      throw new Error('note not found');
    }
    return note;
  }

  editNoteById(id, {title, body, tags}) {
    const noteIndex = this._notes.findIndex((val) => val.id === id);

    if (noteIndex === -1) {
      throw new Error('note not found');
    }

    const updatedAt = new Date().toISOString();
    this._notes[noteIndex] = {
      ...this._notes[noteIndex],
      title,
      tags,
      body,
      updatedAt,
    };
  }

  deleteNoteById(id) {
    const noteIndex = this._notes.findIndex((val) => val.id === id);
    if (noteIndex === -1) {
      throw new Error('note not found');
    }

    this._notes.splice(noteIndex, 1);
  }
}

export default NotesService;
