const express = require("express");
const ExpressError = require("./expressError");
const items = require("./items")

const app = express();

app.use(express.json())
app.use(express.urlencoded( {extended: true}))

app.use('/items', items)

app.use(function (req, res, next) {
    const err = new ExpressError("Not Found",404);
  
    // pass the error to the next piece of middleware
    return next(err);
  });

app.use(function (err, req, res, next) {
    res.status(err.status || 500);

    return res.json({
    error: err
    });
});

module.exports = app;

