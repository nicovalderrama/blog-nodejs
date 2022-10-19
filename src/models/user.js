const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcrypt = require('bcryptjs');

const userSchema = new Schema({
    email: {type: String, required: true},
    password: {type: String, required: true},
}, {
    methods: {
            encryptPassword: (password) => {
                const salt =bcrypt.genSaltSync(10);
                const hash = bcrypt.hashSync(password, salt);
                return hash;
            },
            comparePassword: function (password) {
                return bcrypt.compareSync(password, this.password);
            }
        }
    },{
        versionKey: false
    }
);

module.exports = mongoose.model('users', userSchema);