var express = require('express');
var router = express.Router();
const uuid = require('uuid');
const path = require('path');
const exec = require('child_process').exec;
const config = require('../config/config')

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Express' });
});


router.get('/getimage', (req, res, next) => {
  console.log(`phantomjs path ${config["phantomjs-path"]}`);
  const url = decodeURIComponent(req.query.url);
  console.log(url);
  const rastrizeLibPath = path.join(__dirname, '../lib/rasterize.js')
  const fileName = `${uuid.v4()}.png`;
  const outputFile = path.join(__dirname, `../public/output/${fileName}`)
  let phantomjsPath = 'phantomjs'
  if(config["phantomjs-path"] != ''){
    phantomjsPath = config["phantomjs-path"];
  }
  const cmd = `${phantomjsPath} ${rastrizeLibPath} ${url} ${outputFile} "1920px"`;
  console.log(cmd)
  exec(cmd, (err, stdout, stderr) => {
    if(err){
      console.log('in err');
      res.send(err)
    }
    else{
      // res.send(`/output/${fileName}`);
      console.log('sending redirect');
      res.status(200).json({imageURL:`/output/${fileName}`})
      // res.writeHead(302, {
      //   'Location' : `/output/${fileName}`
      // })
      // res.end();
    }
  })
  // (async function() {
  //   const instance = await phantom.create();
  //   const page = await phantom.create();
  //   console.log('waiting for page');
  //   await page.on('onResourceRequested', function(requestData) {
  //     console.info('Requesting', requestData.url);
  //   });
  //   console.log('getting url');
  //   const status = await page.open('https://www.amazon.com/');
  //   console.log('saving image');
  //   var render = await page.render('amazon.png');
  //   console.log(render);
  //   await instance.exit();
  //   res.send('23232');
  // })();
})
module.exports = router;
