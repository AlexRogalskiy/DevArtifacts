package org.eamonn.matrix

import Matrix._

class JamaMatrix(m:Matrix, jm:Jama.Matrix) {

  private var cachedJm = jm
  private var cachedM  = m
  private var cachedLU:Jama.LUDecomposition = null

  private def asJm = {
    if(cachedJm==null){
      cachedJm = new Jama.Matrix( m.map{_.toArray}.toArray )
    }
    cachedJm
  }

  private def asLU = {
    if(cachedLU==null){
      cachedLU = new Jama.LUDecomposition( asJm )
    }
    cachedLU
  }

  def asMatrix = {
    if(cachedM==null){
      cachedM = jm.getArray.map{_.toList}.toList
    }
    cachedM
  }

  def det = asJm.det

  def inverse = new JamaMatrix( null, asJm.inverse )

  def solve( b:Matrix ) = new JamaMatrix( 
    null,
    asJm solve new Jama.Matrix( b.map{_.toArray}.toArray )
  )

  def solveLU( b:Matrix ) = new JamaMatrix( 
    null,
    asLU solve new Jama.Matrix( b.map{_.toArray}.toArray )
  )

  def normInf = asJm.normInf

  override def toString = {
    "\n[ " + asMatrix.map{ "["+ _.mkString("\t")+"]" }.mkString("\n  ")+" ]\n"
  }

}

