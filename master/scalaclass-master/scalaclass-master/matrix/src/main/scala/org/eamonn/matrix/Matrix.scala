/*
 * Copyright (c) 2010 Eamonn O'Brien-Strain, eob@well.com
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which is available at http://www.eclipse.org/legal/epl-v10.html
 */


package org.eamonn.matrix

import Matrix._
import Row._
import Seq.Projection



object Matrix{
  import util.Contract._

  /** A convenient alias */
  type Matrix = List[Row]

  /** effectively add RichMatrix methods to List[List[Double]] */
  implicit def pimp1(m:Matrix) = new RichMatrix(m)

  implicit def pimp2(m:List[Projection[Double]]) 
    = new RichMatrix(m.map{_.toList})
  implicit def pimp3(m:Projection[List[Double]]) 
    = new RichMatrix(m.toList)
  implicit def pimp4(m:Projection[Projection[Double]]) 
    = new RichMatrix(m.map{_.toList}.toList)

  implicit def pimp5(m:Matrix) = new JamaMatrix( m, null )

  implicit def pimp6(jm:JamaMatrix) = new RichMatrix(jm.asMatrix)

  implicit def pimp7(jm:JamaMatrix) = jm.asMatrix

  def apply( rowCount:Int, colCount:Int )( f:(Int,Int) => Double ) = (
      for(i <- 1 to rowCount) yield 
	( for( j <- 1 to colCount) yield f(i,j) ).toList
    ).toList



}
