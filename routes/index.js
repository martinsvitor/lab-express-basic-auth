const router = require("express").Router();


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

module.exports = isLoggedIn;
module.exports = router;
