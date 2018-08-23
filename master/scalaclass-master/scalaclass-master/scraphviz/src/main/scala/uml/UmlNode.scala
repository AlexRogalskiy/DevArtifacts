/* Copyright (c) 2010 Eamonn O'Brien-Strain, eob@well.com
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which is available at http://www.eclipse.org/legal/epl-v10.html
 */
package org.eamonn.scraphviz.uml

import core.{ DiNode, HasAtts }
import HasAtts.unquote
import Uml._

class UmlNode(graph:Uml,name:String) extends DiNode(graph,name){

  shape('record)
	fontsize(10)

  private val self = this
  class Member(m1:String){
    def /( m2:String ) = new Member(m1+"\\n"+m2)
    def | { label( m1.replaceAll("""/""","""\\n""") ); UmlNode.this }
  } 

  def |( m:String ) = new Member( name+"|"+m )

  def <>-(that:UmlNode) = this -> that arrowtail 'odiamond arrowhead 'vee color HASA fontsize 8
  def #-(that:UmlNode) = this -> that arrowtail 'diamond arrowhead 'vee color HASA fontsize 8
  def <>-*(that:UmlNode) = ( this <>- that) taillabel "1" headlabel "*"
  def *<>-*(that:UmlNode) = ( this <>- that) taillabel "*" headlabel "*"
  def *#-*(that:UmlNode) = ( this #- that) taillabel "*" headlabel "*"
  def #-*(that:UmlNode) = ( this #- that) taillabel "1" headlabel "*"

  def -<>(that:UmlNode) = {that <>- this; that}
  def -#(that:UmlNode) = {that #- this; that}
  def *-<>(that:UmlNode) = {that <>-* this; that}
  def *-#(that:UmlNode) = {that #-* this; that}
  def *-<>*(that:UmlNode) = {that *<>-* this; that}
  def *-#*(that:UmlNode) = {that *#-* this; that}

  def <|-(that:UmlNode) = {
    (that -> this) arrowhead 'onormal arrowtail 'none arrowsize 2 color ISA fontsize 8 label "is a"
    that
  }
  
  def -|>(that:UmlNode) = { that <|- this ; that }
  
  
  def -->(that:UmlNode)  = (this -> that) arrowhead 'vee style 'dashed color USES fontsize 8
  def -->*(that:UmlNode) = (this --> that) taillabel "1" headlabel "*"
  def *-->*(that:UmlNode) = (this --> that) taillabel "*" headlabel "*"
  
  def <--(that:UmlNode)  = that --> this
  def *<--(that:UmlNode) = that -->* this
  def *<--*(that:UmlNode) = that *-->* this

	override def label(lab:String) =  super.label( if(graph.rankdir=='LR) lab else "{"+lab+"}" ) 

}
