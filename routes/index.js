var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  let products=[
    {
      name:"Redme 9",
      catogory:"Mobile",
      description:"This is Brand New SmartPhone",
      image:"data:image/jpeg;base64,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"
    },
    {
      name:"IPHONE 11",
      catogory:"Mobile",
      description:"This is Brand New SmartPhone",
      image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTykmrTM_ixeSByCQpaQq0toQrnFMX1Onlry9t7lA-yUQAItfHIP2WshuFN3DXmVKqeo1oATds&usqp=CAc"
    },
    {
      name:"Sony ZR",
      catogory:"Mobile",
      description:"This is Brand New SmartPhone",
      image:"data:image/jpeg;base64,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"
    },
    {
      name:"Realme9i",
      catogory:"Mobile",
      description:"This is Brand New SmartPhone",
      image:"data:image/jpeg;base64,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"
    }
  ]
  res.render('index', {products,admin:false});
});

module.exports = router;
