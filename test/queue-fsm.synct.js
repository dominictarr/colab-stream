
var qfsm = require('../queue-fsm')
  , it = require('it-is')

function s (str){
  return str.split(' ')
}

exports ['states & events'] = function (){
  var f = qfsm()
    , states = s('start ready post queued')
    , events = s('send tick error response')

  it(f.getStates().sort()).deepEqual(states.sort())
  it(f.getEvents().sort()).deepEqual(events.sort())
}

exports ['sequences'] = function (){
  var examples =
  [ [s('send tick'), 'post']
  , [s('send tick send response response'), 'start']
  , [s('send tick send error response'), 'start']
  , [s('send tick send error error error error'), 'post']
  , [s('send tick send error error response'), 'start'] ]

  it(examples).every(function check(args){
    var f = qfsm()
    it(f.sequence(args[0]).getState()).equal(args[1])
  })
}
