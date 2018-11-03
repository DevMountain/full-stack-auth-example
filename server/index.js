const path = require('path');
// Load in the ".env" file from the specified path
require('dotenv').config({
  path: path.join(__dirname, '..', '.env')
});

const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const Auth0Strategy = require('passport-auth0');
const massive = require('massive');
const session = require('express-session');

const app = express();

// Setting up express-session to save logged in user's session
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}));
// Setting up bodyParser to read data
// from a body of a request
app.use(bodyParser.json());
// Initialize Passport
app.use(passport.initialize());
// Tell passport to use sessions
app.use(passport.session());
// Serve up built react project
app.use(express.static(
  path.join(__dirname, '..', 'build')
));

massive(process.env.CONNECTION_STRING, {
  // Load SQL files from db directory
  scripts: path.join(__dirname, '..', 'db')
}).then( db => {
  app.set('db', db);
  // Create Users Table in database
  // if it doesn't already exist
  db.users_table_create()
    .then(() => {
      console.log('Created Users Table')
    })
})

passport.use(new Auth0Strategy({
  domain: process.env.AUTH_DOMAIN,
  clientID: process.env.AUTH_CLIENT_ID,
  clientSecret: process.env.AUTH_CLIENT_SECRET,
  callbackURL: '/auth/callback',
  scope: 'openid email profile'
}, (accessToken, refreshToken, extraParams, profile, done) => {
  const db = app.get('db');

  db.find_user([ profile.id ])
    .then((user) => {
      if (user[0]) {
        return done( null, { id: user[0].id } );
      } else {
        // Create the user in our database if they don't already exist
        db.create_user([profile.displayName, profile.emails[0].value, profile.picture, profile.nickname])
          .then( user => {
            return done( null, { id: user[0].id } );
          })
      }
    })
}));

app.get('/auth', passport.authenticate('auth0'));

app.get('/auth/callback', passport.authenticate('auth0', {
  successRedirect: `${process.env.FRONTEND_URL}#/private`,
  failureRedirect: `${process.env.FRONTEND_URL}#/`
}))

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  app.get('db').find_session_user([user.id])
    .then((user) => {
      return done(null, user[0]);
    })
});

app.get('/auth/me', (req, res) => {
  // Return the current logged
  // in user if one exists
  if (!req.user) {
    return res.status(401).send({ status: 'Log in required' });
  } else {
    return res.status(200).send(req.user);
  }
})

app.get('/auth/logout', (req, res) => {
  req.logOut();
  return res.redirect(`${process.env.FRONTEND_URL}#/`);
})

let PORT = process.env.SERVER_PORT || 3005;
app.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`);
})    
