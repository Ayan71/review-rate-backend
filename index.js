const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());
const dotenv = require("dotenv");
dotenv.config();

const PORT = process.env.PORT;

const connectDB = require("./config/database");

// database connection
connectDB();

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
const authRoutes = require("./route/authRoutes");
app.use("/api/auth", authRoutes);

const companyRoutes = require("./route/companyRoutes");
app.use("/api/company", companyRoutes);

const reviewRoutes = require("./route/reviewRoutes");
app.use("/api/review", reviewRoutes);

// default route
app.get("/", (req, res) => {
  res.send("Server is running");
});

// server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});