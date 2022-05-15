// express
const express = require("express");
const app = express();

// ========================
// IMPORTS
// ========================

// import core modules
const path = require("path");

// import cors
const cors = require("cors");

// import helmet
const helmet = require("helmet");

// import database connection funtion
const connectDB = require("./helpers/connect-db");

// import mongoose models

// import route handling middlewares
const systemRouter = require("./routes/system");
const studentRouter = require("./routes/student");
const facultyRouter = require("./routes/faculty");
const adminRouter = require("./routes/admin");
const generalRouter = require("./routes/general");
const authRouter = require("./routes/auth");
const { protectRoute } = require("./middlewares/auth");

// import controllers
const errorController = require("./controllers/error");

// ========================
// SETUP
// ========================

// ========================
// MIDDLEWARES
// ========================

// cors
app.use(
  cors({
    origin: "*",
  })
);

// setting headers
app.use(helmet());

// body parsing
app.use(express.json());

// serving public static files
app.use(express.static(path.join(__dirname, "public")));

// route handling middlewares
app.use(generalRouter);
app.use("/system", systemRouter);
app.use("/student", studentRouter);
app.use("/faculty", facultyRouter);
app.use("/admin", adminRouter);
app.use("/auth", authRouter);

// handling 404 requests
app.use(errorController.get404);

// error handling middleware
app.use((error, req, res, next) => {
  console.log(error.message);
  const statusCode = error.statusCode || 500;
  let message = "Internal server error.";
  if (statusCode < 500) {
    message = error.message;
  }

  res.status(statusCode).json({ message: message });
});

// ========================
// START SERVER AND DB
// ========================

// connecting to db and starting server
connectDB()
  .then((result) => {
    app.listen(process.env.PORT || 8080);
    console.log("Server started.");
  })
  .catch((error) => {
    console.log("Error occured: ", error);
  });
