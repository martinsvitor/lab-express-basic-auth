const router = require("express").Router();
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

// Import sessions
const session = require('express-session');
const User = require('../models/User.model');

const saltRounds = 10;



router.get('/signup', (_,res) => res.render('auth/create-acc'));

router.get('/login', (req,res) => res.render('auth/login'));

router.get('/logout', (req,res) => {
    req.session.destroy(error => {
        if(error){
            console.log(error);
        }
        res.redirect('/');
    });
});




router.post('/signup', (req,res) => {
    const { username, password } = req.body;
        // Testing password strength

    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if(!regex.test(password)){
        res
            .status(500)
            .render('auth/create-acc', { passwordProblem : ['Password must contain at least one of the following:', 'Uppercase letter', 'Lowercase letter','Number','Special character']})
    }
    else {
        bcrypt.genSalt(saltRounds)
        .then(hash => bcrypt.hash(password, hash))
        .then(hashedPass => {
            return User.create({
            username,
            password: hashedPass
        });
        })
        .then(user => {
            res.redirect('/')
        })
        .catch(error => {
            if(error.code === 11000){
                // console.log(error)
                res.status(500).render('auth/create-acc',  {errorMessage: 'Username is already in use' });
            }
            else{
                // console.log(error);
            }
        });
    }
    
});

router.post('/login', (req, res) => {
    const { username, password } = req.body;
    // console.log(username)
    User.findOne({ username: username })
        .then(user => {
            if(!user){
                res.render('auth/login', {errorMessage: 'Username and/or password do not match'})
            }
            else if(bcrypt.compareSync(password, user.password)){
                req.session.currentUser = user;
                // console.log(req.session)
                res.redirect('/main')
            }
            else{
                res.render('auth/login', {errorMessage: 'Username and/or password do not match'})
            }
        })
        .catch(error => console.log(error));
});

module.exports = router;