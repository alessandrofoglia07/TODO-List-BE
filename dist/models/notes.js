import { Schema, model } from 'mongoose';
const NoteSchema = new Schema({
    userEmail: { type: String, required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
});
export default model('Note', NoteSchema);
