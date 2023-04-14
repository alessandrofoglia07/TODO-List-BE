import { Schema, model } from 'mongoose';
const NoteSchema = new Schema({
    userEmail: { type: String, required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
});
const Note = model('Note', NoteSchema);
export default Note;
