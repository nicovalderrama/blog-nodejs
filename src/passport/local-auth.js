const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/user');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id);
    done(null, user);
});

passport.use('local-signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, email, password, done) => {
    const user = await User.findOne({'email': email})

    if(user) {
        return done(null, false, req.flash('signupMessage', 'El correo ya esta en uso, intentalo nuevamente'));
    }else {
        const newUser = new User();
        newUser.email = email;
        newUser.password = newUser.encryptPassword(password);
        await newUser.save();
        console.log(newUser)
        done(null, newUser);
    }
}));

passport.use('local-signin', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, email, password, done) => {
    const user = await User.findOne({email:email})
    if(!user){
        return done(null,false, req.flash('signinMessage', 'No existe el usuario, intentalo nuevamente'));
    }
    if(!user.comparePassword(password)){
        return done(null,false, req.flash('signinMessage', 'Contraseña incorrecta,intentalo nuevamente'));
    }
    done(null, user);
}));