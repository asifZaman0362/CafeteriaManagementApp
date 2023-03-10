"use strict";
exports.__esModule = true;
var express = require("express");
var dotenv = require("dotenv");
dotenv.config();
var app = express();
app.get("/", function (_req, res) {
    res.status(200).send("hello, world!");
});
app.listen(process.env.PORT_NUMBER, function () { return console.log("server started at " + process.env.PORT_NUMBER); });
