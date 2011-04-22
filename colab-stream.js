
var qfsm = require ('./queue-fsm')
  , Queue = require('./queue')

//exports ['test simple'] = function (test){
module.exports = function (opts){
  var queue = new Queue(opts)
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
