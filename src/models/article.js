const mongoose = require('mongoose')
const {marked} = require('marked')
const slugify = require('slugify')
const createDOMPurify = require('dompurify')
const { JSDOM } = require('jsdom')
const dompurify = createDOMPurify(new JSDOM().window)

const articleSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description:{
            type: String
        },
        markdown:{
            type: String,
            required: true
        },
        createdAt: {
            type: Date, 
            default: Date.now 
        },
        slug: {
            type: String,
            required: true,
            unique: true
        },
        sanitizedHtml:{
            type: String,
            required: true
        },
        imageURL:{
            type: String
        },
        public_id:{
            type: String
        }
    },
    {
        versionKey: false
    }
)

// Middleware .pre()

articleSchema.pre('validate', function (next){
    if(this.title){
        this.slug= slugify(this.title, {lower: true, strict: true})
    }
    if(this.markdown){
        this.sanitizedHtml = dompurify.sanitize(marked(this.markdown))
    }
    next();
})

module.exports = mongoose.model('Article', articleSchema)