import { Schema, Document, model } from 'mongoose';

interface IUser {
    email: string;
    password: string;
}

interface IUserModel extends IUser, Document { }

const UserSchema = new Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

export default model<IUserModel>('User', UserSchema);