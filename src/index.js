const express = require('express')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const morgan = require('morgan')
const passport = require('passport')
const session = require('express-session')
const flash = require('connect-flash')

//inicializaciones
const app = express()
require('./database')
require('./passport/local-auth')

//Settings
app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')

//Middlewares
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(methodOverride('_method'))
app.use(morgan('dev'))
app.use(session({
    secret: 'mysecretapp',
    resave: false,
    saveUninitialized: false,
}))
app.use(flash())
app.use(passport.initialize())
app.use(passport.session())
app.use((req, res, next) => {
    app.locals.signupMessage = req.flash('signupMessage')
    app.locals.signinMessage = req.flash('signinMessage')
    app.locals.user = req.user
    app.locals.isAuthenticated = req.isAuthenticated()
    next()
});
app.use(require('./routes/articles'));

app.use('/public/', express.static('./public/'))

app.use(require('./routes/index'))


const port = process.env.PORT || 3000
app.listen(port,
    ()=> console.log(`Servidor escuchando en el puerto ${port}`)
    )