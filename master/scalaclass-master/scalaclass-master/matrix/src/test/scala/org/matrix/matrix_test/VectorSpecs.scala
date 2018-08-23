/*
 * Copyright (c) 2010 Eamonn O'Brien-Strain, eob@well.com
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which is available at http://www.eclipse.org/legal/epl-v10.html
 */

package org.eamonn.matrix_test

import util.Contract.checkPreconditions
import matrix.Row._
import org.specs._

object  VectorSpecs extends Specification {
  checkPreconditions = true

  val ϵ = 1e-10
 
  val a = List( 2.0, 3.0, 4.0 )
  val b = List( 3.0, 4.0, 5.0 )

  "a vector supports addition" in {
    a add b must_== List( 5.0, 7.0, 9.0 )
  }

  "a vector supports dot product" in {
    a * b must beCloseTo( 6.0 + 12.0 + 20.0, ϵ )
  }

}
