
var Queue = require('../queue')
  , it = require('it-is')

exports ['api'] = function (test){

  var queue = new Queue()

  it(queue).has({
    enqueue: it.function()
  , post: it.function()
  , clearSent: it.function()
  , __sent: it.deepEqual([])
  , __queue: it.deepEqual([])
  })

  test.done()
}

exports ['enqueue'] = function (test){
  var q = new Queue()

  function check(add){
    var l = q.__queue.length
    q.enqueue.apply(q,add)
    it(q.__queue.length).equal(l + 1)
    it(q.__queue[q.__queue.length - 1]).deepEqual(add)
  }

  var examples =
      [ [1,2,3]
      , [1]
      , [[]]
      , ['asd'] ]

  examples.forEach(check)

  test.done()
}

exports ['clear sent'] = function (test){
  var q = new Queue()

  q.__queue =
     [ [1,2,3]
      , [1]
      , [[]]
      , ['asd'] ]

  q.__sent =
     [ [1,2,3]
      , [1] ]

  q.clearSent()

  it(q.__sent).deepEqual([])
  it(q.__queue)
    .deepEqual([
      [[]]
    , ['asd']
    ])

  test.done()
}

exports ['post'] = function (test){

  var q = new Queue({
    post:function (e){
      it(e).deepEqual(toSend)
      test.done()
    }
  })
  var toSend = q.__queue =
     [ [1,2,3]
      , [1]
      , [[]]
      , ['asd'] ]

  q.postSending()
}
