var express = require('express');
const { response } = require('../app');
var router = express.Router();
var productHelper = require('../helpers/product-helper')
var userHelper = require('../helpers/user-helpers')
//verifylogin
const verifyLogin = (req, res, next) => {
  if (req.session.loggedIn) {
    next()
  } else {
    res.redirect('/login')
  }
}
/* GET home page. */
router.get('/', async function (req, res, next) {
  let user = req.session.user
  //console.log(user)
  let cartCount = null
  if (req.session.user) {
    cartCount = await userHelper.getCartCount(req.session.user._id)
  }
  productHelper.getAllProducts().then((products) => {
    //console.log(products)
    //console.log(cartCount)
    res.render('user/view-products', { products, user, cartCount })

  })
});
//login verification
router.get('/login', (req, res) => {
  if (req.session.loggedIn) {
    res.redirect('/')
  } else {
    res.render('user/login', { "loginErr": req.session.loginErr })
    req.session.loginErr = false
  }
})
//signup page route
router.get('/signup', (req, res) => {
  res.render('user/signup')
})
router.post('/signup', (req, res) => {
  userHelper.doSignup(req.body).then((response) => {
    //console.log(response)
    req.session.loggedIn = true
    req.session.user = response.user
    res.redirect('/login')
  })
})
//login verification
router.post('/login', (req, res) => {
  userHelper.doLogin(req.body).then((response) => {
    if (response.loginStatus) {
      req.session.loggedIn = true
      req.session.user = response.user
      res.redirect('/')
    } else {
      req.session.loginErr = true
      res.redirect('/login')
    }
  })

})
//logout
router.get('/logout', (req, res) => {
  req.session.destroy()
  res.redirect('/')
})
//cart verification
router.get('/cart', verifyLogin, async (req, res) => {
  let products = await userHelper.getCartProduct(req.session.user._id)
  //console.log(products)
  res.render('user/cart', { products, user: req.session.user })
})

//add product to cart

router.get('/add-to-cart/:id', (req, res) => {
  //console.log("api-call")
  //console.log('->>>>>',req.session.user._id)
  userHelper.addToCart(req.params.id, req.session.user._id).then(() => {
    //res.redirect('/')
    res.json({ status: true })
  })

})

router.post('/change-product-quantity',(req,res,next)=>{
  console.log(req.body)
  userHelper.changeProductQuantity(req.body).then(()=>{
    //console.log(response)
//need to code the ajax auto update on quantity count to client code settings....
    //res.json(response)
  })
})


module.exports = router;
