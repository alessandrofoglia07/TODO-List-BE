import mongoose from "mongoose";
import NoteSchema from './models/notes';
import UserSchema from './models/users';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const URI = process.env.ATLAS_URI as string;

const connectToDB = async () => {
    try {
        await mongoose.connect(URI);
        console.log('Connected to MongoDB');
        app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
    } catch (err) {
        console.log(err);
    }
};
connectToDB();
