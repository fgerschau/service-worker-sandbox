var express = require('express');
var fs = require('fs');
var app = express();

var version = 0;

app.use('/static', express.static(__dirname + '/public'));
app.use('/service-worker.js', express.static(__dirname + '/public/js/service-worker.js'));
app.use('/service-worker.js', (req, res) => {
  const file = fs.readFileSync(__dirname + '/service-worker.js', 'utf8');
  const content = file.replace(/\$version/g, ++version);
  res.setHeader('Content-Type', 'application/javascript');
  res.setHeader('Content-Length', content.length);
  res.send(content);
});


app.set('view engine', 'ejs');
app.set('views', './views');

app.get('/', function (undefined, res) {
  res.render('index');
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
