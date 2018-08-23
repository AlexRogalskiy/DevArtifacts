/*
 * Copyright (c) 2010 Eamonn O'Brien-Strain, eob@well.com
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which is available at http://www.eclipse.org/legal/epl-v10.html
 */


package org.eamonn.published_matrix

import Matrix._
import Row._
import Seq.Projection

/** Methods that are added to List[List[Double]] by an implicit conversion */
case class RichMatrix(m:Matrix){

  def T = transpose(m)

  def *(that:RichMatrix) = mXm( this.m, that.m )

  def apply(i:Int,j:Int) = m(i)(j)

  def rowCount = m.length
  def colCount = m.head.length

  def toStr = "\n"+m.map{ 
    _.map{"\t" + _}.reduceLeft(_ + _)+"\n"
  }.reduceLeft(_ + _)

}


object Matrix{

  /** A convenient alias */
  type Matrix = List[Row]

  def apply( rowCount:Int, colCount:Int )( f:(Int,Int) => Double ) = (
      for(i <- 1 to rowCount) yield 
	( for( j <- 1 to colCount) yield f(i,j) ).toList
    ).toList

  def transpose(m:Matrix):Matrix = 
    if(m.head.isEmpty) Nil else m.map(_.head) :: transpose(m.map(_.tail))

  def mXv(m:Matrix, v:Row) = m.map{ dotProd(_,v) } reduceLeft ( _ + _ )


  def mXm( m1:Matrix, m2:Matrix ) = 
    for( m1row <- m1 ) yield
      for( m2col <- transpose(m2) ) yield
	dotProd( m1row, m2col )

  def rowCount(m:Matrix) = m.length
  def colCount(m:Matrix) = m.head.length


  /** effectively add RichMatrix methods to List[List[Double]] */
  implicit def pimp1(m:Matrix) = new RichMatrix(m)

  implicit def pimp2(m:List[Projection[Double]]) 
    = new RichMatrix(m.map{_.toList})
  implicit def pimp1(m:Projection[List[Double]]) 
    = new RichMatrix(m.toList)
  implicit def pimp2(m:Projection[Projection[Double]]) 
    = new RichMatrix(m.map{_.toList}.toList)
  

}
