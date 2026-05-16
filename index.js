const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());
const dotenv = require("dotenv");
dotenv.config();

const PORT = process.env.PORT;
const cors=require("cors")


app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  })
);
const connectDB = require("./config/database");

// database connection
connectDB();

// middleware — JSON/urlencoded here; multipart is handled only on routes that parse it (e.g. company create/update).
app.use(express.json({ type: "application/json" }));
app.use(
  express.urlencoded({
    extended: true,
    type: "application/x-www-form-urlencoded",
  })
);

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