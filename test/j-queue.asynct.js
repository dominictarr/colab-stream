
var Jq = require('../j-queue')
  , it = require('it-is')
  , http = require('http')
  , echo
  , port = 1234
  , request = require('request')

exports.__setup = function (test){
  var testMessage = 'dsfhaskfjhaskfdjhaskdfhjakscnjkasjcn'

  echo = http.createServer(function (req,res){

    res.writeHead(200,{
      'Content-Type': 'application/json'
    })

    req.on('data',function (e){
      process.nextTick(function (){res.write(e)})
    })

    req.on('end',function () {
      process.nextTick(function(){res.end()})
    })

  })

  echo.listen(port, checkSetup)

  function checkSetup (){

  request({uri: 'http://localhost:' + port, method:'POST', body:testMessage},function (err,res,body){
      if(err)
        return test.error(err)
      console.log('body:',body)
      it(body).equal(testMessage)
      console.log('test.done')

      test.done()
    })
  }
}

exports.__teardown = function (test){

//  if(echo)
    echo.close()
//  test.done()
}

/*exports [ 'test api' ] = function (test){
  it(Jq).function()
  var jq = new Jq()

  it(jq).has({
    send: it.function ()
  , recieve: it.function ()
  , drain: it.function ()
  })

  test.done()
}

//*/



exports ['send messages'] = function (test){

  var jq = new Jq({port: port})
    , messages = [1,2,3,4,5,6,7,8]
    , i = 0

  //make a server which echos commands

  jq.receive = (function (e){
    console.log('>>>',e)
    it(e).equal(messages[i++])
  })
  jq.drain = (test.done) // called when there are no more messages coming...

  messages.forEach(function (e){jq.send(e)})
}

exports ['send a two chunks of messages'] = function (test){

  //send two sets of messages, should get a drain in the middle.

  var jq = new Jq({port: port})
    , messages = [1,2,3,4,5,6,7,8,'a','b','c','d','e','f']
    , i = 0

  jq.receive = (function (e){
    console.log('>>>',e)
    it(e).equal(messages[i++])
  })

  jq.drain = function (){
    it(i).equal(8)
    jq.drain = (test.done) // called when there are no more messages coming...
  }

  messages.slice(0,8).forEach(function (e){jq.send(e)})
  setTimeout(function(){
    messages.slice(8).forEach(function (e){jq.send(e)})
  },10)
}
