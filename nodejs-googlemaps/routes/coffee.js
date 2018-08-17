var express = require('express'),
    router = express.Router();

router.get('/',function(req,res){
  res.render('coffee', { title: 'Some places in Florida', subtitle: 'Node.js / Google Maps Example with the help of the Express, and Jade modules' });
});

module.exports = router;
