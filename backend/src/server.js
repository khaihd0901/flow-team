import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import { connectDB } from "./Libs/DB.js";
import authRoute from "./Routes/authRoute.js"
import userRoute from "./Routes/userRoute.js"

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

//Public Route
app.use('/api/auth', authRoute)
//PrivateRoute
app.use('/api/user', userRoute)


connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on: ${PORT}`);
  });
});
