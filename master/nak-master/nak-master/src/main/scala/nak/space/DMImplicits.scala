
package nak.space

import breeze.generic.UFunc
import breeze.linalg._
import breeze.linalg.operators.{OpMulInner, OpMulMatrix, OpSub}
import breeze.math.{Semiring, MutableInnerProductModule}
import breeze.numerics._

import scala.reflect.ClassTag

/**
 * dialogue
 * 6/19/14
 * @author Gabriel Schubiner <gabeos@cs.washington.edu>
 *
 *
 */
object DMImplicits {

  type chebyshev = chebyshev.type
  type cosine = cosine.type
  type euclidean = euclidean.type
  type mahalanobis = mahalanobis.type
  type manhattan = manhattan.type
  type minkowski = minkowski.type
  type projectedSquaredNorm = projectedSquaredNorm.type

  object projectedSquaredNorm extends UFunc {
    implicit def pSqNorm[T, U](implicit mulImpl: OpMulMatrix.Impl2[U, T, T],
                               subImpl: OpSub.Impl2[T, T, T],
                               normImpl: norm.Impl[T, Double]): Impl3[T, T, U, Double] =
      new Impl3[T, T, U, Double] {
        def apply(v: T, v2: T, proj: U): Double = {
          pow(norm(subImpl(mulImpl(proj, v), mulImpl(proj, v2))), 2)
        }
      }
  }

  object chebyshev extends UFunc {
    implicit def chebyshevDistanceFromZippedValues[T, U]
    (implicit zipImpl: zipValues.Impl2[T, U, ZippedValues[Double, Double]]): Impl2[T, U, Double] =
      new Impl2[T, U, Double] {
        def apply(v: T, v2: U): Double = {
          var minDist = Double.NegativeInfinity
          zipValues(v, v2).foreach {
            (a, b) =>
              val absdiff = abs(a - b)
              if (absdiff > minDist)
                minDist = absdiff
          }
          minDist
        }
      }
  }

  object cosine extends UFunc {
    implicit def cosineDistanceFromZippedValues[T, U]
    (implicit zipImpl: zipValues.Impl2[T, U, ZippedValues[Double, Double]]): Impl2[T, U, Double] =
      new Impl2[T, U, Double] {
        def apply(v: T, v2: U): Double = {
          var numer = 0.0
          var denom = 0.0
          var denom2 = 0.0
          zipValues(v, v2).foreach {
            (a, b) =>
              numer += a * b
              denom += a * a
              denom2 += b * b
          }
          numer / (sqrt(denom) * sqrt(denom2))
        }
      }
  }

  object euclidean extends UFunc {

    implicit def euclideanDistanceFromZippedValues[T, U]
    (implicit zipImpl: zipValues.Impl2[T, U, ZippedValues[Double, Double]]): Impl2[T, U, Double] =
      new Impl2[T, U, Double] {
        def apply(v: T, v2: U): Double = {
          var dist = 0.0
          zipValues(v, v2).foreach {
            (a, b) =>
              val diff = a - b
              dist += (diff * diff)
          }
          sqrt(dist)
        }
      }
  }


  object decomposedMahalanobis extends UFunc {
    //    implicit def decomposedMahalanobisFromLinearTransformationMatrix[T]
    //    (implicit vspace: MutableInnerProductModule[T,Double],
    //      ev: T <:< Vector[Double]): Impl3[T,T,DenseMatrix[Double],Double] = {
    //      import vspace._
    //      new Impl3[T, T, DenseMatrix[Double], Double] {
    //        def apply(v: T, v2: T, A: DenseMatrix[Double]): Double = {
    //          ((A * v) - (A * v2)).t * ((A * v) - (A * v2))
    //        }
    //      }
    //    }
    implicit def decomposedMahalanobisFromLinearTransformationDense(implicit vspace: MutableInnerProductModule[DenseVector[Double], Double]):
    Impl3[DenseVector[Double], DenseVector[Double], DenseMatrix[Double], Double] = {
      import vspace._
      new Impl3[DenseVector[Double], DenseVector[Double], DenseMatrix[Double], Double] {
        def apply(v: DenseVector[Double], v2: DenseVector[Double], A: DenseMatrix[Double]): Double = {
          val c: DenseVector[Double] = (A * v) - (A * v2)
          c dot c
        }
      }
    }

    implicit def decomposedMahalanobisFromLinTransGen[V, M, T](implicit vspace: MutableInnerProductModule[V, T],
                                                               opMulMV: OpMulMatrix.Impl2[M, V, V],
                                                               opSubVV: OpSub.Impl2[V, V, V],
                                                               opDotVV: OpMulInner.Impl2[V, V, T],
                                                               // viewM: M <:< Matrix[T],
                                                               // viewV: V <:< Vector[T],
                                                               semiring: Semiring[T],
                                                               man: ClassTag[T]): Impl3[V, V, M, T] = {
      //      import vspace._
      new Impl3[V, V, M, T] {
        def apply(v: V, v2: V, A: M): T = {
          val c: V = opSubVV(opMulMV(A, v), opMulMV(A, v2))
          opDotVV(c,c)
        }
      }
    }

    implicit def decomposedMahalanobisFromLinearTransformationSparse(implicit vspace: MutableInnerProductModule[SparseVector[Double], Double]):
    Impl3[SparseVector[Double], SparseVector[Double], CSCMatrix[Double], Double] = {
      import vspace._
      new Impl3[SparseVector[Double], SparseVector[Double], CSCMatrix[Double], Double] {
        def apply(v: SparseVector[Double], v2: SparseVector[Double], A: CSCMatrix[Double]): Double = {
          val c = (A * v) - (A * v2)
          c dot c
        }
      }
    }
  }

  object mahalanobis extends UFunc {
    def requireSymmetricMatrix[V](mat: Matrix[V]): Unit = {
      if (mat.rows != mat.cols)
        throw new MatrixNotSquareException

      for (i <- 0 until mat.rows; j <- 0 until i)
        if (mat(i, j) != mat(j, i))
          throw new MatrixNotSymmetricException
    }

    implicit object mahalanobisDistanceFromRawMeanCovValues_DV_DV_DM
      extends Impl3[DenseVector[Double], DenseVector[Double], DenseMatrix[Double], Double] {
      override def apply(v: DenseVector[Double], v2: DenseVector[Double], v3: DenseMatrix[Double]): Double = {
        requireSymmetricMatrix(v3)
        sqrt((v - v2).t * (v3 \ (v - v2)))
      }
    }

    // Assumes rows represent individual data points (i.e. v2 is MxN array comprising M data points in R^N
    //  implicit object mahalanobisDistanceFromPointDistribution_DV_DM extends Impl2[DenseVector[Double],DenseMatrix[Double], Double] {
    //    override def apply(v: DenseVector[Double], v2: DenseMatrix[Double]): Double = {
    //      val means: DenseMatrix[Double] = mean(v2(::, *)) // mean of columns into 1xN Matrix
    //      val centered: DenseMatrix[Double] = v2(*,::) - means
    //      val sampleCov = (1 / v2.rows) :* (centered * centered.t)
    //
    //      mahalanobisDistanceFromRawMeanCovValues_DV_DV_DM(v, means.toDenseVector, sampleCov)
    //    }
    //  }
  }

  object manhattan extends UFunc {
    implicit def manhattanDistanceFromZippedValues[T, U]
    (implicit zipImpl: zipValues.Impl2[T, U, ZippedValues[Double, Double]]): Impl2[T, U, Double] =
      new Impl2[T, U, Double] {
        def apply(v: T, v2: U): Double = {
          var dist = 0.0
          zipValues(v, v2).foreach {
            (a, b) =>
              dist += abs(a - b)
          }
          dist
        }
      }
  }

  object minkowski extends UFunc {
    implicit def minkowskiDistanceFromZippedValues[T, U]
    (implicit zipImpl: zipValues.Impl2[T, U, ZippedValues[Double, Double]]): Impl3[T, U, Double, Double] =
      new Impl3[T, U, Double, Double] {
        def apply(v: T, v2: U, v3: Double): Double = {
          var cumul = 0.0
          zipValues(v, v2).foreach {
            (a, b) =>
              cumul += pow(abs(a - b), v3)
          }
          pow(cumul, 1 / v3)
        }
      }
  }

}
