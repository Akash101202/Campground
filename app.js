if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}
const express = require('express');
const app=express()
const path = require('path')
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

const campgroundsroutes = require('./routes/campground')
const reviewsroutes = require('./routes/review')
const userroutes = require('./routes/user')
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

app.set('views',path.join(__dirname,'views'))
app.set('view engine','ejs');
app.use(express.urlencoded({extended:true}))
app.use(methodOverride('_method'))
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
    console.log("Yelpcamp")
})

