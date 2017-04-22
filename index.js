var express = require("express");
var http = require("http");
var bodyParser = require("body-parser");
var morgan = require("morgan");
var router = require("./router");
const mongoose = require("mongoose");

const app = express();

// DB SETUP
mongoose.connect("mongodb://localhost:auth/auth");

// APP SETUP
app.use(morgan("combined"));
app.use(bodyParser.json({
    type: "*/*"
}));

router(app);

// SERVER SETUP 
var port = process.env.PORT || 3000;
const server = http.createServer(app);
server.listen(port);

console.log("Server is running on :", port);
