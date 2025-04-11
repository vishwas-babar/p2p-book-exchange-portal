import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
dotenv.config()
import userRouter from './routers/user.route';
import bookRouter from './routers/book.route';

const app = express()

const port = process.env.PORT || 3000;

app.use(cors());

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/user', userRouter);
app.use('/api/book', bookRouter);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})   