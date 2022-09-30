import express from 'express';
import mongoose from 'mongoose';
import authRouter from './authRouter.js';

const PORT = process.env.PORT || 5000;

const app = express();

app.use(express.json());
app.use('/auth', authRouter)

const start = async () => {
	try {
		await mongoose.connect(
			'mongodb+srv://ichyryk:3lBo74MFh9o7863R@cluster0.eaqrwsv.mongodb.net/?retryWrites=true&w=majority'
		);
		app.listen(PORT, () => console.log('SERVER START'));
	} catch (e) {
		console.log(e);
	}
};

start();
