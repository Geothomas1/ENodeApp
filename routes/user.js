var express = require('express');
var router = express.Router();
var productHelper=require('../helpers/product-helper')

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

module.exports = router;
