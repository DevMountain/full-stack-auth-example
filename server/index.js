const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env')});

const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const Auth0Strategy = require('passport-auth0');
const massive = require('massive');
const session = require('express-session');

const app = express();

app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true
}));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(__dirname + '/../build'));

massive(process.env.CONNECTION_STRING).then( db => {
  app.set('db', db);
  db.users_table_create()
    .then(() => {
      console.log('Created Users Table')
    })
})

passport.use(new Auth0Strategy({
  domain: process.env.AUTH_DOMAIN,
  clientID: process.env.AUTH_CLIENT_ID,
  clientSecret: process.env.AUTH_CLIENT_SECRET,
  callbackURL: process.env.AUTH_CALLBACK,
  scope: 'openid id email profile'
}, function(accessToken, refreshToken, extraParams, profile, done) {

  const db = app.get('db');
  console.log('profile', profile);

  db.find_user([ profile.nickname ])
  .then( user => {
   if ( user[0] ) {
     return done( null, { id: user[0].id } );
   } else {
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

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  app.get('db').find_session_user([user.id])
  .then( user => {
    return done(null, user[0]);
  })
});

app.get('/auth/me', (req, res) => {
  if (!req.user) {
    return res.status(401).send('Log in required');
  } else {
    return res.status(200).send(req.user);
  }
})

app.get('/auth/logout', (req, res) => {
  req.logOut();
  return res.redirect(`${process.env.FRONTEND_URL}#/`);
})

let PORT = 3005;
app.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`);
})    
