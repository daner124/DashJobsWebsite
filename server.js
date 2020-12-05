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
//firebase.initializeApp(firebaseConfig);
// var admin = require("firebase-admin");

// const serviceAccount = require('./path/to/serviceAccountKey.json');

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount)
// });

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
    var sendEmail = 0;



    getValue(firstName, lastName, email);


    firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;


        switch (errorCode) {
          case 'auth/email-already-in-use':
            console.log(`Email address already in use.`);
            sendEmail++;
            break;
          case 'auth/invalid-email':
            console.log(`Email address is invalid.`);
            sendEmail++;
            break;
          case 'auth/operation-not-allowed':
            console.log(`Error during sign up.`);
            sendEmail++;
            break;
          case 'auth/weak-password':
            console.log('Password is not strong enough. Add additional characters including special characters and numbers.');
            sendEmail++;
            break;
          default:
            console.log(error.message);
            sendEmail++;
            break;
        }
    });

    //sends email only if user is new
    if(sendEmail == 0) {
        firebase.auth().onAuthStateChanged(function(user) {
          if (user) {
            user.sendEmailVerification().then(function() {
              // Email sent.
            }).catch(function(error) {
              // An error happened.
            });
          } else {
            // No user is signed in.
          }
        });
    }

    res.sendFile(__dirname + '/signedUp.html');


});


async function getValue (firstName, lastName, email){

    const docRef = db.collection('users').doc('email');
    // const time = Date.now();

    await docRef.set({
        time: '2',
        email: 'word',
        firstName: 'word',
        lastName: 'word'
      });
};

app.listen(port, function(){
  console.log("Server running");
});
