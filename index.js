import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import connectMongoDB from './db.js';

const app = express();

const PORT = 8000;
dotenv.config();
connectMongoDB();

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
  res.json({ message: 'This Api is working' });
});
app.listen(PORT, () => {
  console.log(`Server running at port ${PORT}`);
});
