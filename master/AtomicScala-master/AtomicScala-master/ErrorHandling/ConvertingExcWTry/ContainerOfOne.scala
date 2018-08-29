import util.{Try, Success}

Try("1".toInt).map(_+1)
Try("1".toInt).map(_+1).foreach(println)
Try("x".toInt).map(_+1).foreach(println)
