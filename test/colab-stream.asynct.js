
var colab = require ('../colab-stream')
  , it = require('it-is')

exports ['simple'] = function (test){

  var messages = [1,2,3,4,5,6,12,23,345,56,67,88]
    , sending = [].concat(messages)
    , recieved = []
  //just mock out the server...
  var errCount = 0
  var cs = colab({
    get: function (){
      //request update from server.
      console.log('getting!')
      //actually needs to request the number it's up to.
      var fsm = this
    },
    abortGet: function (){
      console.log('ABORT GET')
    },
    post: function (data){
      //send messages to server
      console.log("POST:", data)
      var fsm = this
      //test error handling.
      Math.random() < 0.5
        ? this.event('error')//error three times.
        : setTimeout(function (){
            console.log('TIMEOUT')
            return fsm.event('response', [data])
          },20)
    },
    response: function (data){
      errCount = 0
      console.log('RESPONSE',data)
      data.forEach(response)
      drain()
    }
  })

  /*
  cs.send(1)
  cs.send(2)
  cs.send(3)
  setTimeout(function(){
    cs.send(23)
    cs.send(34)
    cs.send(45)
    setTimeout(function(){
      cs.send(203)
      cs.send(304)
      cs.send(405)
    },2)
  },2)*/

  function send(){
    if(!sending.length)
      return
    cs.send(sending.shift())
    Math.random() < 0.5 ? send() : setTimeout(send,2)//defur
  }

  send()
  function response(data){
    [].push.apply(recieved,data)
  }
  function drain(){
    console.log('DRAIN', recieved, messages)
    if(recieved.length == messages.length){
      it(recieved).deepEqual(messages)
      test.done()
    }
  }

  /*
    next is some assertions...

    then, create two colabs, connect to a server,
    send messages from one, should recieve the same set of messages from both...

    (one getting it's reponse from get, other from post)

    get will need to give the last id it recieved...

    support a session id...

    next is to write the server side?
      recieves post/:id : new items (which it adds to the list)
      get/:id/:from returns items that come after :from

      the server may veto some items and not return them.

      if a request comes in, and something has already been written by another client,
      it responds with the official messages.
  */
}
