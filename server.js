const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const session = require('express-session')
const flash = require('express-flash')
const passport = require('passport')
const path = require('path')
const methodOverride = require('method-override')

const ArticleRouter = require('./routes/article')
const ArticleData = require('./models/article')
const AccountRouter  = require('./routes/account')

const app = express()

const initializePassport = require('./config/passport')
initializePassport(passport)

dotenv.config({ path: './config/config.env' })
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    createIndex: true
}).then(() => console.log('MongoDB Connected'))
.catch(err => console.log(err))
app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.use(methodOverride('_method'))
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())

app.use('/article', ArticleRouter)
app.use('/account', AccountRouter)



app.get('/',  async (req, res) => {
    user = { }
    if(req.isAuthenticated()) {
        user = {
            status: 'loggedIn',
            name: req.user.username
        }
    }
    const articles = await ArticleData.find().sort({createdAt: -1})
    res.render('index', { articles: articles, user: user})
})


app.listen(process.env.PORT)