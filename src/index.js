const express = require('express')
const mongoose = require('mongoose')
const Article = require('./models/article')
const articleRouter = require('./routes/articles')
const methodOverride = require('method-override')
const morgan = require('morgan')
const passport = require('passport')
const session = require('express-session')
const flash = require('connect-flash')
const multer = require('multer');
const path = require('path');

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
const storage = multer.diskStorage({
    destination: path.join(__dirname, 'public/uploads'),
    filename: (req, file, cb, filename) => {
        cb(null, new Date().getTime() + path.extname(file.originalname));
    }
}) 
app.use(multer({storage}).single('image'));


app.use(require('./routes/articles'));

app.use('/public/', express.static('./public/'))

app.use(require('./routes/index'))


const port = process.env.PORT || 3000
app.listen(port,
    ()=> console.log(`Servidor escuchando en el puerto ${port}`)
    )