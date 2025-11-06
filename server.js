require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const connectDB = require("./config/db");
const uploadRoutes = require("./routes/api/upload");

// routes
const testRoutes = require("./routes/api/test");
const authRoutes = require("./routes/api/auth");

const app = express();
const PORT = process.env.PORT || 5001;

// connect database
connectDB();

// middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// api routes
app.use("/api/test", testRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoutes);

// global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
