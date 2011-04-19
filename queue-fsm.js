

var FSM = require ('fsm')

module.exports = newQueue

function newQueue(){

  return new FSM({
    start: {
      send: 'ready'
    , response: 'start'
    //_in: long poll
    },
    ready: {
      tick: 'post' //will send
    , send: 'ready'
    //_in: enqueue, cancelLongPoll
    },
    post: {
      send: 'queued'
    , error: 'post'
    , response: 'start'
    //_in: post
    },
    queued: {
      send: 'queued'
    , error: 'post'
    , response: 'post' //clearSent
    //_in: enqueue
    }
  })

}
