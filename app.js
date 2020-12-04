const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");

const app = express();

app.set('view engine', 'ejs');

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  next();
});

app.use(bodyParser.urlencoded({extended: true}));

const UserData = require('./controller/user');



app.use('/', UserData);



app.get("/login", function(req, res) {
  res.render("login");
});

app.get("/profile", function(req, res) {
  res.render("profile");
});

app.get("/appointment", function(req, res) {
  res.render("appointment");
});

app.get("/register", function(req, res) {
  res.render("register");
});



app.listen(3000, function() {
  console.log("Server started on port 3000");
});
