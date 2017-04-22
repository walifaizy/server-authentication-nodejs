const jwt = require("jwt-simple");
const User = require("../models/user");
const config = require("../config");

function tokenForUser(user) {
    const timeStamp = new Date().getTime();
    return jwt.encode({sub: user.id, iat: timeStamp}, config.secret);
}

exports.signin = function(req, res, next) {
    res.send({token: tokenForUser(req.user)});
}

exports.signup = function (req, res, next) {
    const email = req.body.email;
    const password = req.body.password;
    
    if(!email || !password) {
        return res.status(422).send({error: "You must provide email and password"});
    }
    
    // See if the user given email exists
    User.findOne({email: email}, function(err, existingUser) {
        if(err) {return next(err);}
        
        // if a user with email does exists , return an error
        if(existingUser) {
            return res.status(422).send({error: "Email already in use"});
        }
        
        // if a user with email does not  exists , create and save the record
        const user = new User({
            email: email,
            password: password
        });
        
        user.save(function(err) {
            if(err) {return next(err);}
            res.json({token: tokenForUser(user)});
        });
        
    });
}
