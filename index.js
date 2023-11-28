import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import connectMongoDB from './db.js';
import authRoutes from './Routes/Auth.js';
import productRoutes from './Routes/Product.js';
import imageRoutes from './Routes/imageUploadRoutes.js';

const app = express();

const PORT = 8000;

dotenv.config();

connectMongoDB();

app.use(bodyParser.json());

app.use(bodyParser.json());
const allowedOrigins = ['http://localhost:3000']; // Add more origins as needed

// Configure CORS with credentials
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true, // Allow credentials
  })
);

app.use(cookieParser());

app.use('/auth', authRoutes);
app.use('/product', productRoutes);
app.use('/image', imageRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'This Api is working' });
});
app.listen(PORT, () => {
  console.log(`Server running at port ${PORT}`);
});
