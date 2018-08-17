var express = require('express'),
    router = express.Router();

router.get('/',function(req,res){
  res.render('pizza', { title: 'Simple Google Map with Node JS', subtitle: 'Google Map JS API with Node JS. Google Map Node API will be used in the future.' });
});

module.exports = router;
