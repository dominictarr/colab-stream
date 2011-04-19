module.exports = Queue

function Queue (opts){
  if(!(this instanceof Queue)) return new Queue(opts)
  this.__queue = []
  this.__sent = []
  this.enqueue = function (){
    var queue = this.__queue
      , a = []
    while(arguments.length)
      a.push([].shift.call(arguments))

    queue.push(a)
  }

  this.doPost = function (){
    throw new Error ("must assign a doPost function")
  }
  this.post = function (){
    var queue = this.__queue
    var sent = this.__sent
    queue.forEach(function (e){
      sent.push(e)
    })

    this.doPost(JSON.stringify(sent))
  }
  this.clearSent = function (){

    while(this.__sent.length){
      this.__queue.shift(); this.__sent.shift()
    }
  }
}
