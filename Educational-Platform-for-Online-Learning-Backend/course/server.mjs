import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";
import cookieparser from 'cookie-parser';
import logger from "./utils/logger.mjs";
import databaseConnection from "./config/database.mjs";
import CourseRoute from "./routes/courseRoute.mjs";

const app = express();
const PORT = process.env.PORT || "8070";
dotenv.config();

app.use(cors());

const corsOptions = {
  origin: ['http://localhost:3000', 'http://localhost:4000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.use(cors(corsOptions));
  
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieparser());

app.use("/v1/courses", CourseRoute);

app.listen(PORT, () => {
    logger.info(`Server is up and running on port ${PORT}`);
    databaseConnection();
})

export default app;
