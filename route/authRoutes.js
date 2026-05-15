const express=require("express");
const app=express.Router();
const { SignUp, login } = require("../controller/authController");

app.post("/signup", SignUp);
app.post("/login", login);

module.exports=app;