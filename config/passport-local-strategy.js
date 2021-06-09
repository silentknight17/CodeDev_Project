const passport=require('passport');

const LocalStrategy= require('passport-local').Strategy;

const User=require('../models/user');

//Authentication using passport
passport.use(new LocalStrategy({
    usernameField:'email',
    passReqToCallback: true
},

function(req, email,password,done){
//Find a user and establish the identity
User.findOne({email:email},function(err,user){
if(err)
{
    req.flash('error',err);
    return done(err);
}
if(!user||user.password!=password){
    req.flash('error','Invalid Username/Password');
    return done(null,false);
}

return done(null,user);
});
}
));

//serialising the user to decide which key is to be kept in the cookies
passport.serializeUser(function(user,done){
done(null,user.id);
});

//deserialising the user from the key in the cookies
passport.deserializeUser(function(id,done){
    User.findById(id,function(err,user){
    if(err)
    {
        console.log('Error in finding the user---> Passport');
        return done(err);
    }
    return done(null,user);
    });
});

// Check if the user is authenticated
passport.checkAuthentication=function(req,res,next){
    //If the user is signed in, then pass on the request to the next fucntion (controller's action) 
    if(req.isAuthenticated()){
       return next(); 
    }

    //if the user is not signed in
    return res.redirect('/user/sign-in');

}

passport.setAuthenticatedUser=function(req,res,next){
    if(req.isAuthenticated()){
     //req.user contains the current signed in user from the session cookie adn we are just sending this to the locals for the views.
     res.locals.user=req.user; 
    }
    next();
}


module.exports=passport;

