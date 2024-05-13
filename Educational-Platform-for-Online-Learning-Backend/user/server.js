const express = require("express");
const cors = require("cors");
const databaseConnection = require("./config/dbConnection");
const dotenv = require("dotenv");
dotenv.config();
const app = express();
const port = process.env.PORT || 8090;

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:4000"],
    credentials: true,
  })
);

app.use("/v1/users", require("./routes/userRoutes"));

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  databaseConnection();
});

module.exports = app;
