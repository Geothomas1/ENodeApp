var express = require('express');
const { route } = require('./user');
var router = express.Router();
var productHelper = require('../helpers/product-helper');
const { response } = require('../app');
/* GET users listing. */
router.get('/', function (req, res, next) {
  productHelper.getAllProducts().then((products)=>{
    //console.log(products)
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
//delete product
/*
insetd of this way it possible to pass data from as delet-product?id={{this_id}} from view=product.hbs
to get the value here take it as !
let productId=req.query.id

*/
router.get('/delete-product/:id',(req,res)=>{
  let productId=req.params.id
  console.log(productId)
  productHelper.deleteProduct(productId).then((response)=>{
    res.redirect('/admin/')
  })

})

router.get('/edit-product/:id',(req,res)=>{
  res.render('./admin/edit-product')
})

module.exports = router;
