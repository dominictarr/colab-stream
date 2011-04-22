

var FSM = require ('fsm')
  , queue = require('./queue')

module.exports = newQueue

function func(f,n){
  return (f || function (){console.log('no method:' + n)})
}

function newQueue(inject){

  return new FSM({
    start: {
      send: 'ready'
    , response: 'start'
    , _in: func(inject.get)
    },
    ready: {
      tick: 'post' //will send
    , send: 'ready'
    , _in: [func(inject.enqueue),func(inject.abortGet),func(inject.ready,'ready')]
    },
    post: {
      send: 'queued'
    , error: 'post'
    , response: 'start'
    , _in: func(inject.post,'post')
    },
    queued: {
      send: 'queued'
    , error: 'post'
    , response: ['post', func(inject.clearSent)] //clearSent
    , _in: func(inject.enqeue)
    }
  })
}
