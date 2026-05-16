const express=require("express");
const app=express.Router();
const auth = require("../middleware/authMiddleware");
const { createCompany, getAllCompanies, updateCompany, deleteCompany } = require("../controller/companyController");

const {
  requireMultipartBoundary,
} = require("../middleware/multipartUpload");
const { parseCompanyMultipart } = require("../middleware/companyMultipartUpload");

app.post("/create", auth, requireMultipartBoundary, parseCompanyMultipart, createCompany);
app.get("/all", getAllCompanies);
app.put("/update/:id", auth, requireMultipartBoundary, parseCompanyMultipart, updateCompany);
app.delete("/delete/:id", auth, deleteCompany);


module.exports=app;
