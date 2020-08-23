const mongoose = require('mongoose')
const slugify = require('slugify')
const marked = require('marked')
const createDomPurifier = require('dompurify')
const { JSDOM } = require('jsdom')
const dompurify = createDomPurifier(new JSDOM().window)

const articleSchema = new mongoose.Schema({
    title: {
        type: String,
        unique: true
    },
    description: {
        type: String
    },
    markdown: {
        type: String
    },
    slug: {
        type: String,
    },
    sanitizedHtml: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    createdBy: {
        type: String
    }

})

articleSchema.pre('validate', function(next) {
    if(this.title) {
        this.slug = slugify(this.title, {
            lower: true,
            strict: true
        })
    }

    if(this.markdown) {
        this.sanitizedHtml = dompurify.sanitize(marked(this.markdown))
    }

    next()
})

module.exports = mongoose.model("article", articleSchema)