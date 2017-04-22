const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt-nodejs");

const userSchema = new Schema({
    email: {
        type: String,
        unique: true,
        lowercase: true
    },
    password: String
});

// On save Hook, encrypt password
// Before saving the model run this function
userSchema.pre("save", function(next) {
    //get access to the user model
    const user = this;
    
    // Generate a salt than run callback
    bcrypt.genSalt(10, function(err, salt) {
        if(err) {return next(err);}
        
        //hash(encrypt) the password using the salt
        bcrypt.hash(user.password, salt, null, function(err, hash) {
            if(err) {return next(err);}
            
            // Override plain password with encrypted password
            user.password = hash;
            next();
        });
    });
});

userSchema.methods.comparePassword = function(candidatePassword, callback) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch){
        if(err) {return callback(err);}
        
        callback(null, isMatch);
    });
}

const modelClass = mongoose.model("user", userSchema);

module.exports = modelClass;
