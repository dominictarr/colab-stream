

var FSM = require ('fsm')
  , queue = require('./queue')

module.exports = newQueue



function newQueue(inject){

function func(n){
  if(!inject[n])
    throw new Error('inject has no function:' + n)
  return inject[n] //console.log('no method:' + n)})
}


  return new FSM({
    start: {
      send: ['ready',func('ready')]//set timeout to call tick event
    , response: 'start'
    , _in: [func('get'), func('response')]
    },
    ready: {
      tick: 'post'
    , send: 'ready'
    , _in: [func('enqueue'),func('abortGet')]
    },
    post: {
      send: 'queued'
    , error: 'post'
    , response: 'start'
    , _in: func('postSending')
    },
    queued: {
      send: 'queued'
    , error: 'post'
    , response: ['post', func('response'), func('clearSent')] //clearSent
    , _in: func('enqueue')
    }
  })
}
