const express = require('express')

const ArticleData = require('../models/article')

const router = express.Router()


// GET /article/new
router.get('/new', checkAuth, (req, res) => {
    const article = {}
    res.render('new', { article: article })
})


// POST /article/new    
router.post('/new', checkAuth, async (req, res) => {
    const errors = []
    const isTitleExists = await ArticleData.findOne({ title: req.body.title})
    if(isTitleExists) {
        let article = {
            title: req.body.title,
            description: req.body.description,
            markdown: req.body.markdown,
        }
        errors.push({msg: 'title already exists'})
        res.render('new', {errors, article})
    }
    let article = new ArticleData({
        title: req.body.title,
        description: req.body.description,
        markdown: req.body.markdown,
        createdBy: req.user.username
    })
    article = await article.save()
    res.redirect('/')
})


// GET /article/slug
router.get('/view/:slug', async (req, res) => {
    const article = await ArticleData.findOne({ slug: req.params.slug })
    if (article == null) 
        res.sendStatus(404)
    res.render('show.ejs', { article: article})
})


// Get /article/posts
router.get('/posts', checkAuth, async (req, res) => {
    user = {
        status: 'loggedIn',
        name: req.user.username,
        requestedPage: 'posts'
    }
    const articles = await ArticleData.find({createdBy: req.user.username}).sort({createdAt: -1})
    res.render('index', { articles: articles, user: user})
})


// GET /article/edit
router.get('/edit/:slug', checkAuth, async (req, res) => {
    const article = await ArticleData.findOne({ slug: req.params.slug })
    res.render('edit.ejs', { article: article })
})


// Post /article/edit
router.post('/edit/:slug', checkAuth, async (req, res, next) => {
    const update = {
        title: req.body.title,
        description: req.body.description,
        markdown: req.body.markdown,
    }
    await ArticleData.findOneAndUpdate({slug: req.params.slug}, update)
    res.redirect('/')
})


// Delete /article/delete
router.delete('/delete/:id', checkAuth, async (req, res) => {
    await ArticleData.findByIdAndDelete(req.params.id)
    res.redirect('/article/posts')
})


function checkAuth(req, res, next) {
    if(req.isAuthenticated())
        return next()
    else
        res.redirect('/account/login')
}

module.exports = router