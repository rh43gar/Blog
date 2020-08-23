const express = require('express')
const bcrypt = require('bcrypt')
const passport = require('passport')

const AccountData = require('../models/account')

const router = express.Router()

router.get('/login', (req, res) => {
    res.render('login')
})

router.post('/login',passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/account/login',
    failureFlash: true 
}))


router.delete('/logout', (req, res) => {
    req.logOut()
    res.redirect('/')
})

router.get('/signup', (req, res) => {
    res.render('signup')
})

router.post('/signup', async (req, res) => {
    const errors = []
    const isEmailExists = await AccountData.findOne({ email: req.body.email})
    const isUsernameExists = await AccountData.findOne({ username: req.body.username})
    if(isUsernameExists)
        errors.push({msg: 'username already exists'})
    if(isEmailExists) 
        errors.push({msg: 'email already exists'})
    if(isUsernameExists || isEmailExists) 
        res.render('signup', {errors: errors})

    bcrypt.hash(req.body.password, 10, async (err, hash) => {
        if (!err) {
            let accountDetails = new AccountData({
                email: req.body.email,
                username: req.body.username,
                passwordHash: hash
            })
            accountDetails = await accountDetails.save()
            res.redirect('/account/login')
        }else {
            console.log(err)
            res.status(400).send("something went wrong. Try again")
        }
    })
})


module.exports = router

