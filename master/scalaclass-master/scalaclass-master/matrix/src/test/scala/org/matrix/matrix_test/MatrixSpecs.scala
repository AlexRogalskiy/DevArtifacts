/*
 * Copyright (c) 2010 Eamonn O'Brien-Strain, eob@well.com
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which is available at http://www.eclipse.org/legal/epl-v10.html
 */

package org.eamonn.matrix_test

import util.Contract._
import matrix.Matrix
import matrix.Row._
import org.specs._
import org.specs.matcher.Matcher
import Matrix._
import Math.random

object  MatrixSpecs extends Specification {
  checkPreconditions = true
  checkPostconditions = true

  case class beApproxEqual(a: Matrix) extends Matcher[Matrix]() {
    def apply(b: => Matrix) = 
      if(a.rowCount != b.rowCount)
	(false, null, ""+a+" has a different number of rows than "+b)
      else if(a.colCount != b.colCount)
	(false, null, ""+a+" has a different number of columns than "+b)
      else{
	var tot = 0.0
        a.foreachElement{ tot += _ }
        b.foreachElement{ tot += _ }
        val mean = tot/(2*a.rowCount*b.rowCount)
	((a zip b).forall{ rowPair: (Row,Row) =>
	  (rowPair._1 zip rowPair._2).forall{ itemPair: (Double,Double) =>
	    val (aItem,bItem) = itemPair
	    aItem==bItem || ((aItem-bItem)/mean).abs < 0.0001
	  }
	 },
         ""+a+" is approximately equal to "+b,
         ""+a+" is different to "+b
       )
      }
  }

  val M = List(
    List( 1.0, 2.0, 3.0 ),
    List( 4.0, 5.0, 6.0 )
  )
  val MT = List(
    List( 1.0, 4.0 ),
    List( 2.0, 5.0 ),
    List( 3.0, 6.0 )
  )

  val M_X_MT = List(
    List( 1+4+9.0,   4+10+18.0  ),
    List( 4+10+18.0, 16+25+36.0 )
  )

  val v = List( 7.0, 8.0, 9.0 )

  val v_X_MT = List(List( 7+16+27.0, 28+40+54.0 ))

  "a matrix supports transpose" in {
    M.T  must_==  MT
  }

  "you can multiply a matrix by a vector" in {
    v.asMatrix * MT  must_==  v_X_MT
  }

  "you can multiply a vector by a matrix" in {
     MT * v.T     must_==  (v.asMatrix * M).T
    (MT * v.T).T  must_==   v.asMatrix * M
  }

  "you can multiply matrices together" in {
    M * MT  must_==  M_X_MT
  }

  "Example from Paulson Book" in {
    val A = List(List( 2.0, 0.0 ),
		 List( 3.0,-1.0 ),
		 List( 0.0, 1.0 ),
		 List( 1.0, 1.0 ))
    val B = List(List( 1.0,  0.0, 2.0 ),
		 List( 4.0, -1.0, 0.0 ))
    val C = List(List(  2.0,  0.0, 4.0 ),
		 List( -1.0,  1.0, 6.0 ),
		 List(  4.0, -1.0, 0.0 ),
		 List(  5.0, -1.0, 2.0 ))
    A * B  must_==  C

    C( 1, 2 ) must_== 6.0
  }

  "can handle big matrices" in {
    val m100x200 = Matrix(100,200) { (i:Int,j:Int) =>
      random
    }
    m100x200.rowCount must_== 100
    m100x200.colCount must_== 200
    val m200x300 = Matrix(200,300) { (i:Int,j:Int) =>
      random
    }
    m200x300.rowCount  must_==  200
    m200x300.colCount  must_==  300
    val m100x300  = m100x200 * m200x300
    m100x300.toList.rowCount must_== 100
    m100x300.toList.colCount must_== 300
  }

  "multiplying by the identity matrix gives you the original matrix" in {
    val m5 = Matrix(5,5) { (i:Int,j:Int) =>
      random
    } 
    val I5 = Matrix(5,5) { (i:Int,j:Int) => 
      if(i==j) 1.0 else 0.0
    }

    m5 * I5  must_==  m5
    I5 * m5  must_==  m5
  }

  "create an upper triangular matrix" in {
    val A = Matrix(20,20) { (i:Int,j:Int) => 
      if( i <= j ) 1.0 else 0.0 
    }
    
    A(15,5) must_== 0.0
    A(5,15) must_== 1.0
  }

  "You can take the inverse of a 1x1 matrix" in {
    List(List( 2.0 )).inverse.asMatrix  must_==  List(List( 0.5 )) 
    List(List( 0.5 )).inverse.asMatrix  must_==  List(List( 2.0 ))
  }

  "You can take the inverse of a 2x2 matrix" in {

    val A =   List(List(  1.0, -1.0 ),
		   List( -1.0, -1.0 ))
    val Am1 = List(List(  0.5, -0.5 ),
		   List( -0.5, -0.5 ))
    
    A.inverse.asMatrix    must_==  Am1
    Am1.inverse.asMatrix  must_==  A

    val I =   List(List( 1.0, 0.0 ),
		   List( 0.0, 1.0 ))

    A * A.inverse  must_==  I

  }

  "You can take the inverse of a 3x3 matrix" in {

    val A =   List(List(  2.0,  0.0,  4.0 ),
		   List(  5.0,  1.0,  7.0 ),
		   List(  1.0,  0.0,  1.0 ))
    val Am1 = List(List( -0.5,  0.0,  2.0 ),
		   List( -1.0,  1.0, -3.0 ),
		   List(  0.5,  0.0, -1.0 ))

    assert( A.det != 0 )
    
    A.inverse.asMatrix    must beApproxEqual( Am1 )
    Am1.inverse.asMatrix  must beApproxEqual( A )

    val I =   List(List( 1.0, 0.0, 0.0 ),
		   List( 0.0, 1.0, 0.0 ),
		   List( 0.0, 0.0, 1.0 ) )

    A * A.inverse.asMatrix  must beApproxEqual(I)

  }

  "You can find the determinant of a 2x2 matrix" in {
    val (a,b,c,d) = ( 111.0, 222.0, 333.0, 444.0 )
    val A = List( List(a,b), List(c,d) )

    A.det must_== a*d - b*c
  }

  "You can find the determint of a 4x4 matrix" in {
    //See http://www.wolframalpha.com/input/?i=determinant[+{+{2%2C0%2C1%2C1}%2C{1%2C1%2C1%2C1}%2C+{1%2C0%2C1%2C1}%2C+{1%2C1%2C1%2C0}+}]

    val A =   List(List(  2.0,  0.0,  1.0,  1.0 ),
		   List(  1.0,  1.0,  1.0,  1.0 ),
		   List(  1.0,  0.0,  1.0,  1.0 ),
		   List(  1.0,  1.0,  1.0,  0.0 ))
    A.det must_== -1
  }

  "You can take the inverse of a 4x4 matrix" in {

    //See http://www.wolframalpha.com/input/?i=invert[+{+{2%2C0%2C1%2C1}%2C{1%2C1%2C1%2C1}%2C+{1%2C0%2C1%2C1}%2C+{1%2C1%2C1%2C0}+}]

    val A =   List(List(  2.0,  0.0,  1.0,  1.0 ),
		   List(  1.0,  1.0,  1.0,  1.0 ),
		   List(  1.0,  0.0,  1.0,  1.0 ),
		   List(  1.0,  1.0,  1.0,  0.0 ))
    val Am1 = List(List(  1.0, -0.0, -1.0,  0.0 ),
		   List(  0.0,  1.0, -1.0,  0.0 ),
		   List( -1.0, -1.0,  2.0,  1.0 ),
		   List(  0.0,  1.0,  0.0, -1.0 ))

    println( "A.det="+A.det)

    assert( A.det != 0 )
    
    A.inverse.asMatrix   must_==  Am1
    Am1.inverse.asMatrix  must_==  A

    val I =   List(List( 1.0, 0.0, 0.0, 0.0 ),
		   List( 0.0, 1.0, 0.0, 0.0 ),
		   List( 0.0, 0.0, 1.0, 0.0 ),
		   List( 0.0, 0.0, 0.0, 1.0 ) )

    A * A.inverse  must beApproxEqual(I)

  }


  "can calculate the minor matrix of a 2x2 matrix" in {
    val A =   List(List( 1.0, 2.0 ),
		   List( 3.0, 4.0 ))

    A.minor(0,0) must_== List(List(4.0))
    A.minor(0,1) must_== List(List(3.0))
    A.minor(1,0) must_== List(List(2.0))
    A.minor(1,1) must_== List(List(1.0))
  }

  "can calculate the minor matrix of a 3x3 matrix" in {
    val A =   List(List(  2.0,  0.0,  4.0 ),
		   List(  5.0,  1.0,  7.0 ),
		   List(  1.0,  0.0,  1.0 ))
    A.minor(0,0) must_== List(List(  1.0,  7.0 ),
			      List(  0.0,  1.0 ))
    A.minor(2,1) must_== List(List(  2.0,  4.0 ),
			      List(  5.0,  7.0 ))
    A.minor(1,2) must_== List(List(  2.0,  0.0 ),
			      List(  1.0,  0.0 ))
  }
  "can calculate the minor matrix of a 4x4 matrix" in {
    val A =   List(List(  2.0,  0.0,  1.0,  3.0 ),
		   List(  7.0,  1.0,  1.0,  1.0 ),
		   List(  1.0,  0.0,  1.0,  1.0 ),
		   List(  6.0,  1.0,  1.0,  9.0 ))
    A.minor(2,1) must_==  List(List(  2.0,  1.0,  3.0 ),
			       List(  7.0,  1.0,  1.0 ),
			       List(  6.0,  1.0,  9.0 ))
  }

  "can solve simultaneous linear equations" in {
    // x + y = 10
    // x - y = 2
    // expected solution:
    val A = List(List(1.0,  1.0),
                 List(1.0, -1.0))
    val b = List(10.0, 2.0).T
    val x = A solve b
    x.asMatrix must_== List(6.0, 4.0).T

    //val ax = A * x
    //val approxZero = pimp1(ax) - b
    val approxZero = pimp1(A * x) - b 
    approxZero.normInf must be_<(0.0001)
  }

  "can solve simultaneous linear equations using LU decomposition" in {
    // x + y = 10
    // x - y = 2
    // expected solution:
    val A = List(List(1.0,  1.0),
                 List(1.0, -1.0))
    val b = List(10.0, 2.0).T
    val x = A solveLU b
    x.asMatrix must_== List(6.0, 4.0).T

    //val ax = A * x
    //val approxZero = pimp1(ax) - b
    val approxZero = pimp1(A * x) - b 
    approxZero.normInf must be_<(0.0001)
  }

  def time[T]( label:String, doit : => T ) = {
    val start = System.currentTimeMillis
    val result = doit
    val end = System.currentTimeMillis
    println( label+": "+(end-start)+" ms" )
    result
  }

  "can solve big systems of equations" in {
    val A = Matrix(1000,1000) { (i:Int,j:Int) => random }
    val b = Matrix(1,1000) { (i:Int,j:Int) => random }.T

    {
      val x = time( "solve",  A solve b )
      val approxZero = pimp1(A * x) - b 
      approxZero.normInf must be_<(0.0001)
    }

    {
      val x = time( "LU",  A solveLU b )
      val approxZero = pimp1(A * x) - b 
      approxZero.normInf must be_<(0.0001)
    }

  }


}
