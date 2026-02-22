const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { errors } = require("celebrate");
// Maniuplat envvironment variables
require("dotenv").config();

const { requestLogger, errorLogger } = require("./middlewares/logger");

// Error Codes
const internalServerError = require("./middlewares/error-handlers");

const { PORT = 3001 } = process.env;
const app = express();
const mainRouter = require("./routes/index");

mongoose
  .connect("mongodb://localhost:27017/wtwr_db")
  .then(() => {
    // eslint-disable-next-line no-console
    console.log("Connected to MongoDB");
  })
  .catch((e) => console.error("DB error", e));

app.use(cors());
app.use(express.json());

app.use(requestLogger); // Request logger goes first

// Add the crash test route here (before your main routes)
app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});

// The next line is /signup & /signup route handlers

app.use("/", mainRouter); // routes (this is your "routes")

app.use(errorLogger); // enabling the error logger

app.use(errors()); // celebrate error handler

app.use(internalServerError); //centralized error handler

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server listening on ${PORT}`);
});
