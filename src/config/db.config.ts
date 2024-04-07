//importing modules
import mongoose from 'mongoose'
import dotenv from "dotenv";

dotenv.config();

const connectionString = process.env.DB_CONN_STRING;

//db connection
export const db = mongoose
  .connect(connectionString || "DB_CONN_STRING is not defined.")
  .then(() => {
    console.log(`Database connection successful to ${process.env.DB_NAME}`);
  })
  .catch((err) => {
    console.error('Error connecting to the database:', err);
    process.exit(1);
  });