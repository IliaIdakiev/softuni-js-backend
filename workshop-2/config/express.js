const express = require('express');
const path = require('path');
const handlebars = require('express-handlebars');

module.exports = (app) => {

    app.engine('.hbs', handlebars({ extname: '.hbs' }));
    app.set('view engine', '.hbs');

    app.use(express.urlencoded({ extended: true }));

    const staticFilePath = path.join(global.__basedir, 'static');

    app.use(express.static(staticFilePath));

    app.use(function (err, req, res, next) {
        if (err.message === 'BAD_REQUEST') {
            res.status(400);
            return;
        }
    });
};