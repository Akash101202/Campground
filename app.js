if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}
const express = require('express');
const app=express()
const path = require('path')
const cors = require('cors')
const mongoose = require('mongoose');
const methodOverride=require('method-override')
const ejsMate=require('ejs-mate')
const ExpressError = require('./utils/ExpressError');
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const User = require('./models/user')
const MongoStore = require('connect-mongo');
const passportConfig = require('./controllers/passport');
const Razorpay = require('razorpay');  
const campgroundsroutes = require('./routes/campground')
const reviewsroutes = require('./routes/review')
const userroutes = require('./routes/user')
const bodyParser = require('body-parser');
// process.env.DB_URL
// 'mongodb://localhost:27017/Yelpcamp'

const dbUrl =process.env.DB_URL;
mongoose.connect(dbUrl)
.then(()=>{
    console.log("Connection Open")
})
.catch(err=>{
    console.log("Error")
    console.log(err)
})


app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
  });
  
  const corsOptions = {
    origin: 'http://localhost:3000', // Update this to match your frontend URL
    credentials: true,
  };
  
  app.use(cors(corsOptions))
  
  app.use(
    cors({
      origin: [process.env.FRONTEND_URL],
      methods: ["GET", "PUT", "DELETE", "POST"],
      credentials: true,
      
    })
  );

app.set('views',path.join(__dirname,'views'))
app.set('view engine','ejs');
app.use(express.urlencoded({extended:true}))
app.use(methodOverride('_method'))
app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))
app.engine('ejs',ejsMate)


const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret: 'thisshouldbeabettersecret!'
    }
});

const sessionConfig = {
    store,
    name: 'session',
    secret:'Thisshouldbe better',
    resave: false,
    saveUninitialized:true,
    cookie:{
        httpOnly:true,
        expAge :Date.now()+ 1000*60*60*24*7,
        maxAge: 1000*60*60*24*7,
        cookie: { secure: true }
    }
}



app.use(session(sessionConfig))
app.use(flash())

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req,res,next)=>{
    console.log(req.session)
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error')
    next();
})


app.get('/',(req,res)=>{
    res.render('home')
})

// // Facebook OAuth Routes
// app.get('/auth/facebook',
//     passport_auth.authenticate('facebook')
// );

// app.get('/auth/facebook/callback',
//     passport_auth.authenticate('facebook', { failureRedirect: '/' }),
//     (req, res) => {
//         res.redirect('/');
//     }
// );



app.use(express.static(path.join(__dirname,'public')))

app.use('/campgrounds', campgroundsroutes)
app.use('/campgrounds/:id/reviews', reviewsroutes)
app.use('/', userroutes)


app.all('*',(req,res,next)=>{

    next(new ExpressError('Page not found',404))
})

app.use((err,req,res,next)=>{
    
    const {statusCode=500} = err
    if(!err.message) err.message='oh no something went wrong'
    res.status(statusCode).render('error',{err}) 
})






app.listen(3000,()=>{
    console.log("TrailHaven")
})



app.get('/auth/google', 
  passportConfig.authenticate('google', { scope : ['profile', 'email'] }));
 
app.get('/auth/google/callback', 
  passportConfig.authenticate('google', { failureRedirect: '/register' }),
  function(req, res) {
    // Successful authentication, redirect success.
    res.redirect('/campgrounds');
  });
