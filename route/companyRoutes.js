const express=require("express");
const app=express.Router();
const auth = require("../middleware/authMiddleware");
const { createCompany, getAllCompanies, updateCompany, deleteCompany } = require("../controller/companyController");

const { storage } = require('../storage/storage');
const multer = require('multer');
const upload = multer({ storage });

app.post("/create", auth,upload.single('image'),createCompany);
app.get("/all", getAllCompanies);
app.put("/update/:id", auth, upload.single('image'), updateCompany);
app.delete("/delete/:id", auth, deleteCompany);


module.exports=app;
