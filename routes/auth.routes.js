const router = require("express").Router();
const bcrypt = require('bcryptjs');

const User = require('../models/User.model');

const saltRounds = 10;

router.get('/signup', (_,res) => res.render('signup/create-acc'));

router.post('/signup', (req,res) => {
    const { username, password } = req.body;
    // try {
    //     const salt = await bcrypt.genSalt(saltRounds);
    //     const hashedPasswowrd = await bcrypt.hash(password, salt);
    //     await User.create({
    //         username,
    //         password: hashedPasswowrd
    //     });
    //     res.redirect('/');
        
    // } catch (error) {
    //     console.log(error)
    // };
    bcrypt.genSalt(saltRounds)
        .then(hash => bcrypt.hash(password, hash))
        .then(hashedPass => {
            User.create({
            username,
            password: hashedPass
        });
        res.redirect('/');
    })
        .catch(error => console.log(`Error when creating user: ${error}`));
    
});

module.exports = router;