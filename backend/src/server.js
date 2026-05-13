import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import { connectDB } from "./Configs/databaseConfig.js";
import { errorHandler } from "./Middlewares/errorMiddleware.js";
import authRoute from "./Routes/authRoute.js"
import userRoute from "./Routes/userRoute.js"
import mediaRoute from "./Routes/mediaRoute.js"
import friendRoute from "./Routes/friendRoute.js"
import conversationRoute from "./Routes/conversationRoute.js"
import messageRoute from "./Routes/messageRoute.js"
import {app,server} from '../src/socket/index.js'

dotenv.config();

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
app.use('/api/media', mediaRoute)
app.use('/api/friend', friendRoute)
app.use('/api/conversation', conversationRoute)
app.use('/api/message', messageRoute)


app.use(errorHandler);

connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`server running on ${PORT}`);
  });
});