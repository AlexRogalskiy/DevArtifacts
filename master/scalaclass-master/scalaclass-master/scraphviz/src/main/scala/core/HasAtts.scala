/* Copyright (c) 2010 Eamonn O'Brien-Strain, eob@well.com
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which is available at http://www.eclipse.org/legal/epl-v10.html
 */

package org.eamonn.scraphviz.core

import HasAtts._

trait HasAtts{

  private var attList = List[String]()

  protected def att(name:Symbol, value:String)  {
    attList ::= unquote(name)+"=\""+value+"\""
  }

  protected def att(name:Symbol, value:Symbol)  { att( name, unquote(value) ) }

  protected def att(name:Symbol, value:Float)   { att( name, value.toString ) }

  protected def att(name:Symbol, value:Boolean)   { att( name, value.toString ) }

  def atts = if(attList.isEmpty) "" else  "["+attList.mkString(",")+"]"

	def isEmpty = attList.isEmpty
}

object HasAtts{
  def unquote(s:Symbol) = s.toString substring 1
}
