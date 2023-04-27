import express, { response } from "express";
import bodyParser from "body-parser";
import ejs from "ejs";
import allRoutes from "./src/routes/routes.js"
import mongoose from "mongoose";
import passport from "passport";
import passportLocal from "passport-local"
import cors from "cors";
import cookieParser from "cookie-parser";
import session from "express-session";
import flash from "connect-flash";
import googleAuth from "passport-google-oauth20";
import facebookAuth from "passport-facebook";
import dotenv from "dotenv/config.js"
import dbMethods from "./src/models/databaseMethods.js";
import entryController from "./src/controllers/entryController.js";
// dotenv.config()

const GoogleStrategy = googleAuth.Strategy;
const FacebookStrategy = facebookAuth.Strategy;
const localStrategy = passportLocal.Strategy;

mongoose.set('strictQuery', true);
mongoose.connect(process.env.DBURL); 

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('MongoDB connection established successfully!');
});

const app = express();
app.use(cors({optionsSuccessStatus:200}));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.json())
app.use(cookieParser());
app.use(session({
  secret: "SecretKey",
  resave: false,
  saveUninitialized: false, 
  cookie: {
    maxAge: 1000*60*60*24
}
}))

app.use(flash())
app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", "views");
app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy({
  usernameField: "email",
  passwordField: "password",
  passReqToCallback: true
}, async (req, email, password, done)=>{
   const authenticateuser = await entryController.postLoginControl(email, password);
    if(authenticateuser) return done(null, authenticateuser, null)
    return done(null, false, req.flash("errors","Incorrect email or password"))
}))

passport.use(new GoogleStrategy({
clientID:'568395425038-iic9l2bac797h1fv5h8odj6jmuqlmll0.apps.googleusercontent.com',
clientSecret: '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',
callbackURL: "http://localhost/googleAuth"
},  async function(accessToken, refreshToken, profile, cb) {
  const user = {email: profile.emails[0].value, username: profile.name.givenName, googleId: profile.id}
   dbMethods.findAndUpdate(user)
   .then(foundUser=>{
    console.log(foundUser)
    return cb(null, foundUser);
   })
   .catch(e=>{
    return cb(e, null)
   })
  }
 ))

passport.use(new FacebookStrategy({
clientID: '1269733813580115',
clientSecret:'dd86e620a45ece3858c63760aa593c5f',
callbackURL: "http://localhost/facebookAuth"
}, function(accessToken, refreshToken, profile, cb) {
  const user = {username: profile.displayName, facebookId: profile.id}

  fetch(`https://graph.facebook.com/${profile.id}?fields=id,name,email&access_token=${accessToken}`)
  .then((data)=>{
     return data.json();
  }).then((response=>{
    user.email = response.email;
    console.log(user)
    dbMethods.findAndUpdate(user)
    .then(foundUser=>{
     return cb(null, foundUser);
    })
    .catch(e=>{
     return cb(e, null)
    })
  }))
 
} ))

passport.serializeUser(function(user, done){
  done(null, user)
})

passport.deserializeUser(async function(userid, done){
   const user = await  dbMethods.findSomeThingById(userid);
   if (user) return done(null, user) 
   else return done(null, null)
})

allRoutes(app);


app.listen(process.env.PORT || 3000, ()=>{
    console.log("Your app is running at port 80")
})

export default app;
