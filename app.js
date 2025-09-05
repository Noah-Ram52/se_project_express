// const express = require("express");
// const mongoose = require("mongoose");
// const mainRouter = require("./routes/index");
// const app = express();
// const { PORT = 3001 } = process.env;

// mongoose
//   .connect("mongodb://127.0.0.1:27017/wtwr_db")
//   .then(() => {
//     console.log("Connected to DB");
//   })
//   .catch(console.error);

// //
// app.use(express.json());
// app.use("/", mainRouter);

// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });

const express = require("express");
const mongoose = require("mongoose");

const { PORT = 3001 } = process.env;
const app = express();
const mainRouter = require("./routes/index");

mongoose
  .connect("mongodb://localhost:27017/wtwr_db")
  .then(() => {})
  .catch((e) => console.error("DB error", e));

app.use(express.json());

// app.use((req, res, next) => {
//   req.user = {
//     _id: "5d8b8592978f8bd833ca8133",
//   };
//   next();
// });

app.use("/", mainRouter);

app.listen(PORT, () => {});
