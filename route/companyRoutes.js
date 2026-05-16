const express=require("express");
const app=express.Router();
const auth = require("../middleware/authMiddleware");
const { createCompany, getAllCompanies, updateCompany, deleteCompany } = require("../controller/companyController");

const { storage } = require('../storage/storage');
const multer = require('multer');
const {
  requireMultipartBoundary,
  wrapMulter,
} = require("../middleware/multipartUpload");
const upload = multer({ storage });
const uploadImage = wrapMulter(upload.single("image"));

app.post("/create", auth, requireMultipartBoundary, uploadImage, createCompany);
app.get("/all", getAllCompanies);
app.put("/update/:id", auth, requireMultipartBoundary, uploadImage, updateCompany);
app.delete("/delete/:id", auth, deleteCompany);


module.exports=app;
