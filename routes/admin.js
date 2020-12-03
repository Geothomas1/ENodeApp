var express = require('express');
const { route } = require('./user');
var router = express.Router();
var productHelper = require('../helpers/product-helper')
/* GET users listing. */
router.get('/', function (req, res, next) {
  productHelper.getAllProducts().then((products)=>{
    console.log(products)
    res.render('admin/view-products', { admin: true, products })

  })
});
router.get('/add-product', (req, res) => {
  res.render('admin/add-product')
})
router.post('/add-product', (req, res) => {
  //console.log(req.body)
  //console.log(req.files.image)
  productHelper.addProduct(req.body, (id) => {
    //console.log(id)
    let image = req.files.image
    image.mv('./public/product-images/' + id + '.jpeg', (err, data) => {
      if (!err) {
        res.render('admin/add-product')
      }
      else {
        console.log(err)
      }

    })

  })
})

module.exports = router;
