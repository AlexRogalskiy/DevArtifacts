package org.gs.queue

import scala.collection.mutable.ArrayBuffer

/** For max value on Q extends PriorityQueue
  *
  * @tparam A keys are generic
  * @param pq priority queue array
  * @param ord implicit Ordering
  * @see [[https://algs4.cs.princeton.edu/24pq/MaxPQ.java.html]]
  * @author Scala translation by Gary Struthers from Java by Robert Sedgewick and Kevin Wayne.
  */
class MaxPQ[A](pq: ArrayBuffer[A])(implicit ord: Ordering[A]) extends PriorityQueue(pq) {

  /** insert key */
  def insert(key: A): Unit = insert(key, less)

  /** remove max element */
  def pop(): Option[A] = pop(less)

  /** check parent and children are in proper indexes */
  def isMaxHeap(): Boolean = checkHeap(less)

  /** return keys in descending sorted order */
  def keys(): Seq[A] = pq sorted(Ordering[A].reverse)

  /** return keys as string */
  override def toString(): String = toString(keys)
}
