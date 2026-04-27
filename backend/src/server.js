import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import { connectDB } from "./Libs/DB.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

//middlewares
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: true, // reflect request origin
    credentials: true,
  })
);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on: ${PORT}`);
  });
});
