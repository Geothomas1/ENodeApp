var express = require('express');
const { response } = require('../app');
var router = express.Router();
var productHelper=require('../helpers/product-helper')
var userHelper=require('../helpers/user-helpers')
/* GET home page. */
router.get('/', function (req, res, next) {
  productHelper.getAllProducts().then((products)=>{
    console.log(products)
    res.render('user/view-products', { admin: false, products })

  })
});

router.get('/login',(req,res)=>{
  res.render('user/login')
})
router.get('/signup',(req,res)=>{
  res.render('user/signup')
})
router.post('/signup',(req,res)=>{
  userHelper.doSignup(req.body).then((response)=>{
    console.log(response)
  })

})

module.exports = router;
