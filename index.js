import express from 'express';

const app = express();

import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();
const PORT = 8000;

app.get('/', (req, res) => {
  res.json({ message: 'This Api is working' });
});
app.listen(PORT, () => {
  console.log(`Server running at port ${PORT}`);
});
