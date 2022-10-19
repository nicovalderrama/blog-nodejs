const express = require("express");
const router = express.Router();

const passport = require("passport");

router.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/',
    failureRedirect: '/',
    passReqToCallback: true
}));


router.post('/login', passport.authenticate('local-signin', {
    successRedirect: '/',
    failureRedirect: '/',
    passReqToCallback: true
}));

router.post('/logout', function(req, res, next){
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/');
    });
});

function isAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/');
}

module.exports = router;