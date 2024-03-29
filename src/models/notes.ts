import { Schema, Document, model } from 'mongoose';

interface INote {
    userEmail: string;
    title: string;
    content: string;
}

interface INoteModel extends INote, Document { }

const NoteSchema = new Schema({
    userEmail: { type: String, required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
});

const Note = model<INoteModel>('Note', NoteSchema);

export default Note;