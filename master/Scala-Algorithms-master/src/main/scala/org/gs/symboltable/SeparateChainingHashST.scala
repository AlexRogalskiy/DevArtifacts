package org.gs.symboltable

/** Hash keys to array index allow for collisions with a list at each index
  *
  * @tparam A generic key type, its hash code is used
  * @tparam B generic value type
  * @param initialSize of array
  * @see [[https://algs4.cs.princeton.edu/34hash/SeparateChainingHashST.java.html]]
  * @author Scala translation by Gary Struthers from Java by Robert Sedgewick and Kevin Wayne.
  */
class SeparateChainingHashST[A, B](initialSize: Int) {
  private var m = initialSize
  private var n = 0
  private var st = new Array[List[(A, B)]](m)

  /** turn hash into array index */
  private def hash(key: A): Int = (key.hashCode & 0x7fffffff) % m

  private def chainGet(x: (A, B), key: A): Boolean = (x._1 == key)

  /** number of key value pairs */
  def size(): Int = n

  /** returns true if zero pairs */
  def isEmpty(): Boolean = size == 0

  /** get value for key if it is present */
  def get(key: A): Option[B] = {
    val i = hash(key)
    if (st(i) == null) None else {
      st(i).find(chainGet(_, key)) match {
        case None => None
        case Some(x) => Some(x._2)
      }
    }
  }

  /** returns true if key present */
  def contains(key: A): Boolean = get(key) != None

  /** delete pair for key if it is present */
  def delete(key: A): Unit = {
    val i = hash(key)
    val chainList = st(i)
    val j = chainList indexWhere (chainGet(_, key))
    if (j != -1) st(i) = chainList.take(j) ++ chainList.takeRight(chainList.length - j - 1)
  }

  /** insert pair, resize if necessary */
  def put(key: A, value: B): Unit = if (value == null) delete(key)
  else {
    if (n >= 10 * m) resize(2 * m)
    val i = hash(key)
    if (st(i) == null) {
      st(i) = List((key, value))
      n += 1
    } else {
      st(i) = (key, value) :: st(i)
      if (!st(i).contains(key)) n += 1
    }
  }

  private def resize(chains: Int): Unit = {
    val tmp = new SeparateChainingHashST[A, B](chains)
    for (chain <- st; kv <- chain) tmp.put(kv._1, kv._2)
    m = tmp.m
    st = tmp.st
  }

  /** returns keys */
  def keys(): List[A] = {
    val ks = for {
      chain <- st
      if (chain != null)
      kv <- chain
    } yield kv._1
    ks.toList
  }
}
