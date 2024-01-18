import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';







const app = express();
app.use(express.json());


app.listen(3007, () => { 
    console.log('Server is running on port 3007');
});
mongoose.connect(process.env.MONGO).then (()=>{
    console.log('Database connected');
}) .catch((err)=>{
    console.log(err);
})
//define routes
app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);


