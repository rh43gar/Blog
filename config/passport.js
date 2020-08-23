const accountData = require('../models/account')
const bcrypt = require('bcrypt')
const localStrategy = require('passport-local').Strategy

function initialize(passport) {
    const authenticateUser = async (email, password, done) => {
        const user = await accountData.findOne({ email: email })
        if(user == null) 
            return done(null, false, { message: "Email or Password is incorrect"})
        
        try {
            if(await bcrypt.compareSync(password, user.passwordHash))
                return done(null, user)
            else
                return done(null, false, { message: "Email or Password is incorrect"})
        }
        catch(e) {
            return done(e)
        }
    }

    passport.use(new localStrategy({ usernameField: 'email'}, authenticateUser))
    passport.serializeUser((user, done) => done(null, user.id))
    passport.deserializeUser(async (id, done) => {
        const user = await accountData.findOne({_id: id})
        return done(null, user)
    })
}

module.exports = initialize