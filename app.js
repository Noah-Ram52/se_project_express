const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const errorHandler = require("./middlewares/error-handlers");

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

app.use("/", mainRouter);

app.use(errorHandler);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server listening on ${PORT}`);
});
