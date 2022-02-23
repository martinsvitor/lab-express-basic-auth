const { findByIdAndUpdate } = require("../models/User.model");

const router = require("express").Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User.model');



const saltRounds = 10;

//Middleware for testing authorization
const isLoggedIn = (req,res,next) => {
  if(!req.session.currentUser){
    res.redirect('/');
  }
  else{
    next();
  }
};

/* GET home page */
router.get("/", (req, res, next) => {
  if(req.session.currentUser){
    res.redirect('/main');
  }
  else{
  res.render("index");
}
});

// Get logged in main page
router.get('/main', isLoggedIn, (req,res, next) => {
  const { currentUser } = req.session;
  if(req.session.currentUser){
    console.log(currentUser)
  res.render('user/main', { currentUser });}
  else{
      res.redirect('/login', { errorMessage: 'Access denied'});
  };
});

router.get('/private', isLoggedIn, (req, res, next) => {
  res.render('user/private');
})


router.post('/updateAcc', isLoggedIn, (req, res, next) => {
  const { currentUser } = req.session;
  const { email1, email2, oldPassword, newPassword } = req.body;
  if (email1 !== email2) {
    return res.render('user/private', { errorMessage: 'Emails doesn`t match' });
  };
  if(oldPassword || newPassword){
    if(bcrypt.compareSync(oldPassword, currentUser.password)){
      return res.render('user/private', { errorMessage: 'Password does not match'})}
  }

  const updatePass = bcrypt.genSalt(saltRounds)
  .then(hash => bcrypt.hash(newPassword, hash))
  .then(hashed => hashed)
  .catch(error => console.log('Error when trying to create password to update', error));
 Promise.all(updatePass).then(pass =>
   User.findByIdAndUpdate(currentUser._id, {
     email: email1,
     password: pass}, { new: true })
       .then(updatedUser => res.render('user/private', { successMessage : 'Saved changes!'}))
       .catch(error => console.log('Error when trying to update data', error))
   // console.log(currentUser);
 })

 )

router.post('/deleteAcc', isLoggedIn, (req, res, next) =>{
  const { currentUser } = req.session;
  User.findByIdAndDelete(currentUser._id)
    .then(() => res.redirect('/'))
    .catch(error => console.log('Error when trying to delete the account',error));
});

module.exports = isLoggedIn;
module.exports = router;
