
const mongoose = require('mongoose')

const Schema = mongoose.Schema
const passportLocalMongoose = require('passport-local-mongoose')

const UserSchema = new Schema ({
    email:{
        type:String,
        required:true,
        unique:true
    },
    role:{
        type:String,
        enum:['user','admin'],
        default:'user'
    },
    googleId: String,
    
    
})
UserSchema.statics.findOrCreate = function findOrCreate(profile, cb) {
    const userObj = new this();
    this.findOne({ googleId: profile.id }, (err, result) => {
        if (!result) {
            userObj.googleId = profile.id || null;
            userObj.username = profile.displayName;
            userObj.save(cb);
        } else {
            cb(err, result);
        }
    });
};

UserSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model('User',UserSchema)