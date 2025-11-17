import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import morgan from "morgan";
import connectDB from "./config/db.js";

// routes
import uploadRoutes from "./routes/api/upload.js";
import testRoutes from "./routes/api/test.js";
import authRoutes from "./routes/api/authRoutes.js";
import propertyRoutes from "./routes/api/propertyRoutes.js";

// connect database
connectDB();

const app = express();
const PORT = process.env.PORT || 5005;

// middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/uploads", express.static("uploads"));

// api routes
app.use("/api/auth", authRoutes);
app.use("/api/test", testRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/properties", propertyRoutes);

// global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
