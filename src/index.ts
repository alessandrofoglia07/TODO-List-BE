import mongoose from "mongoose";
import Note from './models/notes.js';
import User from './models/users.js';
import express, { Request, Response } from 'express';
import authenticateJWT, { AuthenticatedRequest } from "./authentication.js";
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const SaltRounds = 10;

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

const isEmailAlreadyRegistered: (email: string) => Promise<{ bool: boolean, document: any; } | void> = async (email: string) => {
    try {
        console.log('Checking if email is already registered...');
        const result = await User.findOne({ email: email });
        if (result) {
            console.log('Email is already registered');
            return { bool: true, document: result };
        }
        console.log('Email is not registered');
        return { bool: false, document: null };
    } catch (err) {
        console.log(err);
    }
};

app.post('/api/signup', async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        const result = await isEmailAlreadyRegistered(email);
        if (result?.bool) {
            res.status(400).send({ message: 'Email is already registered' });
            return;
        }
        console.log('Creating new user...');
        const hash = await bcrypt.hash(password, SaltRounds);
        const newUser = new User({ email: email, password: hash });
        await newUser.save();
        res.status(201).send({ message: 'User created' });
    } catch (err) {
        res.status(500);
        console.log(err);
    }
});

app.post('/api/login', async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        const result = await isEmailAlreadyRegistered(email);
        if (!result?.bool) {
            res.status(400).send({ message: 'Email not registered' });
            return;
        }
        console.log('User found, checking password...');
        const user = result.document;
        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (isPasswordCorrect) {
            console.log('Password correct, logging in...');
            const accessToken = jwt.sign({ email: user.email }, process.env.JWT_SECRET as string, { expiresIn: '20d' });

            res.status(200).send({ message: 'Login successful', email: user.email, id: user._id, token: accessToken });
            return;
        } else {
            console.log('Password incorrect');
            res.status(400).send({ message: 'Incorrect password' });
            return;
        }
    } catch (err) {
        res.status(500);
        console.log(err);
    }
});

app.post('/api/notes/add', authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
    const { title, content, userEmail } = req.body;

    try {
        console.log('Creating new note...');
        const newNote = new Note({
            userEmail: userEmail,
            title: title,
            content: content
        });
        await newNote.save();
        console.log('Note created');
        res.status(201).send({ message: 'Note created' });
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: 'Error creating note' });
    }
});