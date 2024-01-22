import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';
import postRouter from './routes/post.route.js';
import cookieParser from 'cookie-parser';







const app = express();
app.use(express.json());
app.use(cookieParser());

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
app.use('/api/post', postRouter)


app.use((err, req, res, next) => {
    const statusCode= err.statusCode || 500; //500:internal server error
    const message = err.message || 'Internal server error';
    return res.status(statusCode).json({
        success: false,
        statusCode,
        message,
    });
});


