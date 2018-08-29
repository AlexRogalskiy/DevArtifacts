package com.atomicscala.reporter

import util.Failure
import util.control.NoStackTrace

class FailMsg(val msg: String) extends Throwable with NoStackTrace {
  override def toString: String = msg
}

object Fail{
  def apply(msg:String) = Failure(new FailMsg(msg))
}

