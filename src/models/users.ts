import { Schema, Document, model } from 'mongoose';

interface IUser {
    email: string;
    password: string;
}

interface IUserModel extends IUser, Document { }

const UserSchema = new Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
}, { timestamps: true });

const User = model<IUserModel>('User', UserSchema);

export default User;