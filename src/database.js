const { default: mongoose } = require('mongoose');
require('dotenv').config();

mongoose
    .connect(process.env.MONGODB_URI)
    .then(()=> console.log('conectado a MongoDB Atlas'))
    .catch((err)=> console.error(err))