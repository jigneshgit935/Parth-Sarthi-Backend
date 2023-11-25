import mongoose from 'mongoose';

const connectMongoDB = async () => {
  await mongoose
    .connect(process.env.MONGO_URL, {
      dbName: process.env.DB_NAME,
    })
    .then(() => {
      console.log('Connected to database');
    })
    .catch((err) => {
      console.log('Error connecting to database ' + err);
    });
};

export default connectMongoDB;
