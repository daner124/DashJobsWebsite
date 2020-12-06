//require('dotenv').config({ path: __dirname + '/process.env' });
require('dotenv').config();
require("firebase/auth");
require("firebase/firestore");
const express = require('express');
const bodyParser = require('body-parser');
var firebase = require("firebase/app");
const port = process.env.PORT || 8080;
const app = express();
var nodemailer = require('nodemailer');

console.log(process.env);

var firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: "dash-jobs.firebaseapp.com",
  projectId: "dash-jobs",
  storageBucket: "dash-jobs.appspot.com",
  messagingSenderId: "442347759795",
  appId: "1:442347759795:web:d7012e71dd2588038168c6"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();


app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/resources'));


app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});


app.post('/', function(req, res) {
    var firstName = String(req.body.firstName);
    var lastName = String(req.body.lastName);
    var email = String(req.body.email);
    var password = String(req.body.phone);
    var date = new Date();
    var dateString = String(date.getTime());

    firebase.auth().createUserWithEmailAndPassword(email, password).then(function(){
      const docRef = db.collection("users").doc(email);

      docRef.set({
        email: email,
        firstName: firstName,
        lastName: lastName,
        date: dateString
      });
    });
    
    
    // catch(function(error) {
    //     // Handle Errors here.
    //     var errorCode = error.code;
    //     var errorMessage = error.message;


    //     switch (errorCode) {
    //       case 'auth/email-already-in-use':
    //         console.log(`Email address already in use.`);
    //         break;
    //       case 'auth/invalid-email':
    //         console.log(`Email address is invalid.`);
    //         break;
    //       case 'auth/operation-not-allowed':
    //         console.log(`Error during sign up.`);
    //         break;
    //       case 'auth/weak-password':
    //         console.log('Password is not strong enough. Add additional characters including special characters and numbers.');
    //         break;
    //       default:
    //         console.log(error.message);
    //         break;
    //     }
    // });

    

    res.sendFile(__dirname + '/signedUp.html');


});


app.listen(port, function(){
  console.log("Server running");
});
