const express = require('express');
const router = express.Router();
const firebase = require('firebase');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const config = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID
};
firebase.initializeApp(config);
firebase.auth().signInWithEmailAndPassword(process.env.FIREBASE_AUTH_EMAIL, process.env.FIREBASE_AUTH_PASSWORD);

router.get('/', function (req, res, next) {
  res.render('index.html');
});

router.post('/submit/:id/:songId', function(req, res, next) {
  console.log(req.body);
  const firstName = req.body.first_name;
  const lastName = req.body.last_name;
  delete req.body.first_name;
  delete req.body.last_name;
  const data = {
    first_name: firstName,
    last_name: lastName
  };
  // firebase.database().ref('/submissions/' + req.params.id + '/first_name').set(firstName);
  // firebase.database().ref('/submissions/' + req.params.id + '/last_name').set(lastName);
  firebase.database().ref('/submissions/' + req.params.id + '/' + req.params.songId).set(req.body);
  res.json(200);
});

router.post('/jwt', function(req, res, next) {
  try {
    const data = jwt.verify(req.body.token, process.env.JWT_token);
    firebase.database().ref('/songs/' + data.genre).once('value').then(function(snapshot) {
      const songs = [];
      let end = data.end;
      for (let i = data.start; i < end; i++) {
        if (i >= Object.keys(snapshot.val()).length) {
          break;
        }

        const keys = Object.keys(snapshot.val());
        const key = keys[i];
        const song = snapshot.val()[key];
        if (song.rating == null || song.rating < data.rating) {
          end++;
          continue;
        }
        if (song.duration / 60000 > 20) {
          end++;
          continue;
        }
        songs.push({id: key, url: song.permalink_url });
      }
      data.songs = songs;
      res.json(data);
    });
  } catch(e) {
    res.status(500).json(e);
  }
});

module.exports = router;
