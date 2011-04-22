module.exports = Queue

function makeErr(f){
  return function (){throw new Error ('must pass a ' + f + ' function')}
}

function Queue (opts){
  if(!(this instanceof Queue)) return new Queue(opts)

  var self = this

  opts = opts || {
    get:  makeErr('get')
  , abortGet: makeErr('abortGet')
  , post: makeErr('post')
  , ready :makeErr('ready')
  }

  this.__queue = []
  this.__sent = []

  this.get = opts.get
  this.abortGet = opts.abortGet

  var timeout
  this.ready = function (){
    console.log(this)
    var fsm = this
    if(!timeout)
    timeout = setTimeout(function (){
      timeout = null
      fsm.event('tick')
    },1000)
  }

  this.enqueue = function (){
    var queue = self.__queue
      , a = []
    while(arguments.length)
      a.push([].shift.call(arguments))

    queue.push(a)
    console.log('enqueue:',queue)
  }

  this.post = function (){
    var queue = self.__queue
    var sent = self.__sent
    queue.forEach(function (e){
      sent.push(e)
    })

    opts.post.call(this,sent)
  }
  self.clearSent = function (){

    while(self.__sent.length){
      self.__queue.shift(); self.__sent.shift()
    }
  }
}
