const User =  require('../models/user')


module.exports.register = async(req,res)=>{
    res.render('users/register')
}

module.exports.regFail =async (req, res, next) => {
    try {
        const { email, username, password , googleId} = req.body;
        const user = new User({ email, username});
        const registeredUser = await User.register(user, password);
        const googleRegistered = await User.register(googleId)
        req.login(registeredUser || googleRegistered, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to Yelp Camp!');
            res.redirect('/campgrounds');
        })
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('register');
    }
};



module.exports.login= async(req,res)=>{
   
    res.render('users/login')
}

