import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";
import databaseConnection from "./config/database.mjs";
import logger from "./utils/logger.mjs";
import EnrollmentRouter from "./routes/enrollmentRoute.mjs";
import ProgressRouter from "./routes/progressRoute.mjs";

const app = express();
let PORT = process.env.PORT || "8080";

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
app.use(bodyParser.urlencoded({ extended: true }));

const server = app.listen(PORT, () => {
    logger.info(`Server is up and running on port ${PORT}`);
    databaseConnection();
});

// Routes
app.use("/v1/enrollments", EnrollmentRouter);
app.use("/v1/progress", ProgressRouter);


// Export the server instance for testing
export default server;
