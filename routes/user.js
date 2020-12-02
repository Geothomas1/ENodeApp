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

module.exports = router;
