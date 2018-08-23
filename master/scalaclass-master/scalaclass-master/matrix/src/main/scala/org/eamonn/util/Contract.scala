/*
 * Copyright (c) 2010 Eamonn O'Brien-Strain, eob@well.com
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which is available at http://www.eclipse.org/legal/epl-v10.html
 */
package org.eamonn.util

object Contract{

  var checkPreconditions = false
  var checkPostconditions = false

  def requireEquals[T]( a: => T, b: => T ) {
    if( checkPreconditions ){
      val aa,bb = (a,b)   //avoid calling twice
      if( aa != bb){
	throw new AssertionError("Preconsition failed: "+aa+" != "+bb)
      }
    }
  }
  
  def ensure[T]( postcondition:(T) => Boolean, result:T  ) = {
    if(checkPostconditions){
      if( !postcondition(result) ){
	throw new AssertionError("Postcondition failed for "+result)
      }
    }
    result
  }

}
