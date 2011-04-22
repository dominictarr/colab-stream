
var colab = require ('../colab-stream')

exports ['simple'] = function (test){
  var cs = colab()
  cs.send(1)
  cs.send(2)
  cs.send(3)
}
