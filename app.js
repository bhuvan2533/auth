//jshint esversion:6
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

//For encrypting the plain text
const encrypt = require("mongoose-encryption");

//For Hashing we use md5 package
const md5 = require("md5");

const app = express();
const PORT = 3000 || process.env.PORT;
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

//Connecting our DB with Mongoose
mongoose.connect("mongodb://localhost:27017/userDB", { useNewUrlParser: true });
app.get("/", function (req, res) {
  res.render("home");
});

//Creating a user schema
// const userSchema={
//   email: String,
//   password: String,
// };

//Creating a user schema with mongoose.schema so that we can use our plugins
const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

// let secret = process.env.SECRET;
//? userSchema.plugin(encrypt, { secret: secret, encryptedFields: ["password"] });

//Creating a collection called user which will automatically rename as users which follows userSchema
const User = new mongoose.model("User", userSchema);

//When get req is made to /login ,login page should render
app.get("/login", function (req, res) {
  res.render("login");
});

//When get req is made to /register ,register page should render
app.get("/register", function (req, res) {
  res.render("register");
});

//ENCRYPTION:The data recieved from /register is available here
app.post("/register", function (req, res) {
  const newUser = new User({
    email: req.body.username,
    // password: req.body.password,
    //HASHING
    password: md5(req.body.password),
  });
  newUser.save(function (err) {
    if (err) {
      console.log(err);
    } else {
      res.render("secrets");
    }
  });
});

//The data recieved from /login is available here
app.post("/login", function (req, res) {
  const userName = req.body.username;
  const password = md5(req.body.password);
  //Rendering the secrets page only when the user credentials match with the details in database ...
  User.findOne({ email: userName }, function (err, foundUser) {
    if (err) {
      console.log(err);
    } else if (foundUser) {
      if (foundUser.password === password) {
        res.render("secrets");
      }
    }
  });
});

//Our server will be working/running at the port specified
app.listen(PORT, function () {
  console.log("Server running at port " + PORT);
});
