
var qfsm = require ('./queue-fsm')
  , Queue = require('./queue')

//exports ['test simple'] = function (test){
module.exports = function (){
  var queue = new Queue({
    get: function (){
      console.log('getting!')
      //delay then call q.event('response'[args])
    },
    abortGet: function (){
      console.log('ABORT GET')
      //clear timeout for get
    },
    post: function (data){
      console.log("POST:", data)
      console.log(this)
      var fsm = this
      setTimeout(function (){
        fsm.event('response', data)
      },2000)
    }
  })
  var q = qfsm(queue)

  var o = {}

  q.getEvents().forEach(function (e){
    o[e] = function (){
      var args = []
      while(arguments.length)
        args.push([].shift.call(arguments))
      return q.event(e,args)
    }
  })

  return o
}
//}
