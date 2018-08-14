var express = require('express'),
    path = require('path'),
    jade = require('jade'),
    coffee = require('./routes/coffee'),
    pizza = require('./routes/pizza');

var app = new express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(express.static(path.join(__dirname, 'public')));
app.use('/places', coffee);
app.use('/pizza', pizza);

app.get('/',function(req,res){
  res.render('layout', { title: 'Simple Google Map with Node JS', subtitle: 'Google Map JS API with Node JS. Google Map Node API will be used in the future.' });
});

app.listen(3000)
