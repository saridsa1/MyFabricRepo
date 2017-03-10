/**
 * Created by satyasumansaridae on 3/10/17.
 */
var fs = require('fs'),
    http = require('http'),
    path = require('path'),
    methods = require('methods'),
    express = require('express');

var admin = require('firebase-admin');
var serviceAccount = require("./firebase-config/homeo-ui-firebase-adminsdk-q6osl-3714d78eff.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://homeo-ui.firebaseio.com"
});


// Create global app object
var app = express();

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get("/patientsInfo", function (req, res) {
    admin.database().ref('/PatientInfo').orderByChild('assignedInfo').once('value').then(function (snapshot) {
        res.send(JSON.stringify(snapshot));
        console.log("Finished patients info request");
    });
});

/// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// finally, let's start our server...
var server = app.listen(process.env.PORT || 3001, function () {
    console.log('Listening on port ' + server.address().port);
});