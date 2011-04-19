
var http = require('http')

module.exports = Queue

function Queue (options){
  this.__options = options  = options || {}
  if(!options.method)
    options.method = 'POST'
//  this.__conn = this.connect()
}

/*Funx.prototype = []
function Funx (){
  if(!(this instanceof Funx)) return new Funx()
  var arguments
  this.apply = function (other,args){
    this.forEach(function (e){
      e.apply(other,args)
    })
  }
  this.call = function (){
    var other = [].shift.call(arguments)
      , args = arguments
    this.forEach(function (e){
      e.apply(other,args)
    })
  }
  this.remove = function(func){
    delete this[this.indexOf(func)]
  }
}*/

Queue.prototype = {
  send: function (){
    var a = [], self = this
    while(arguments.length)
      a.push([].shift.call(arguments))

    this.__messages = this.__messages || []
    this.__messages.push(a)
    console.log('send:',a)
//    if(this.__req)
//    this.__req.abort()

    if(this.__timer)//defur sending message, incase send gets called again syncronously.
      clearTimeout(this.__timer)
    this.__timer = setTimeout(function (){
      self.connect()
    },0)
  }
//, __receivers: new Funx()
//, __drains: new Funx()
, receive: function (){}
, drain: function (){}
, connect: function (){

    var self = this
    var req = this.__req = http.request(this.__options,function (res){
      data = ''
      res.on('data',function (e){
        data += e
      })
      res.on('end', function (){
        JSON.parse(data).forEach(function (e){
          self.receive.apply(null,e)
        })
        console.log("DRAQIN!",self.__drains)
        self.drain.call()
      })
    })

    console.log('connect:',this.__messages)
    req.end(JSON.stringify(this.__messages))
    self.__messages = []
  }
}
