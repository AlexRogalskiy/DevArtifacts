package nak.classify

import breeze.linalg._
import breeze.math.{MutableRestrictedDomainTensorField, MutableTensorField, MutableInnerProductModule}
import breeze.storage.Zero
import nak.data.Example

import scala.reflect.ClassTag

/**
 * nak
 * 7/7/14
 * @author Gabriel Schubiner <gabeos@cs.washington.edu>
 *
 *
 */
object Initializers {

  trait Initializer[L, T, M] {
    def init(data: Iterable[Example[L, T]])(implicit vspace: MutableRestrictedDomainTensorField[T,Int,Double],
                                            mspace: MutableRestrictedDomainTensorField[M,(Int,Int),Double],
                                            canDiag: diag.Impl[T,M]): M
  }

  trait ZeroInitializer[L, T, M] extends Initializer[L, T, M] {
    override def init(data: Iterable[Example[L, T]])(implicit vspace: MutableRestrictedDomainTensorField[T,Int,Double],
                                                     mspace: MutableRestrictedDomainTensorField[M,(Int,Int),Double],
                                                     canDiag: diag.Impl[T,M]): M = {
      import vspace._
      val fSize = dim(data.head.features)
      mspace.zero((fSize,fSize))
    }
  }

  trait GenericScaledDiagInitializer[L,T,M] extends Initializer[L,T,M] {
    override def init(data: Iterable[Example[L,T]])(implicit vspace: MutableRestrictedDomainTensorField[T,Int,Double],
                                                    mspace: MutableRestrictedDomainTensorField[M,(Int,Int),Double],
                                                    canDiag: diag.Impl[T,M]): M = {
      import vspace._
      val fSize = dim(data.head.features)

      var maxes = Map.empty[Int,Double]
      var mins = Map.empty[Int,Double]

      for (ex <- data; (i, d) <- ex.features.activeIterator) {
        if (maxes(i) < d)
          maxes = maxes + (i -> d)
        if (mins(i) > d)
          mins = mins + (i -> d)
      }

      val dg = tabulateTensor(fSize,(i: Int) => 1.0 / (maxes(i) - mins(i)))
      diag(dg)
    }
  }

  trait CSCInitializer[L, U] extends Initializer[L, SparseVector[Double], CSCMatrix[Double]] {
    def init(data: Iterable[Example[L, SparseVector[Double]]]): CSCMatrix[Double]
  }

  trait DenseInitializer[L, U] extends Initializer[L, DenseVector[Double], DenseMatrix[Double]] {
    def init(data: Iterable[Example[L, DenseVector[Double]]]): DenseMatrix[Double]
  }

  object CSCInitializers {

    trait ZeroSparseInitializer[L] extends CSCInitializer[L, CSCMatrix[Double]] {
      override def init(data: Iterable[Example[L, SparseVector[Double]]]): CSCMatrix[Double] = {
        val fSize = data.head.features.length
        CSCMatrix.zeros[Double](fSize, fSize)
      }
    }

    trait ScaledDiagSparseInitializer[L] extends CSCInitializer[L, CSCMatrix[Double]] {
      override def init(data: Iterable[Example[L, SparseVector[Double]]]): CSCMatrix[Double] = {
        val fSize = data.head.features.length
        val maxes = new SparseVector[Double](Array.empty, Array.empty[Double], 0, fSize)(Zero[Double](Double.NegativeInfinity))
        val mins = new SparseVector[Double](Array.empty, Array.empty[Double], 0, fSize)(Zero[Double](Double.PositiveInfinity))

        for (ex <- data; (i, d) <- ex.features.activeIterator) {
          if (maxes(i) < d)
            maxes.update(i, d)
          if (mins(i) > d)
            mins.update(i, d)
        }

        val cscBuilder = new CSCMatrix.Builder[Double](fSize, fSize)
        val maxI = maxes.activeIterator
        val minI = mins.activeIterator
        for (i <- 0 until fSize) {
          cscBuilder.add(i, i, 1.0 / (maxes(i) - mins(i)))
        }
        cscBuilder.result(true, true)
      }
    }

  }

  object DenseInitializers {

    trait RandDenseInitializer[L] extends DenseInitializer[L, DenseMatrix[Double]] {
      override def init(data: Iterable[Example[L, DenseVector[Double]]]): DenseMatrix[Double] = {
        val fSize = data.head.features.length
        DenseMatrix.rand[Double](fSize, fSize) / 50.0
      }
    }

    trait ZeroDenseInitializer[L] extends DenseInitializer[L, DenseMatrix[Double]] {
      override def init(data: Iterable[Example[L, DenseVector[Double]]]): DenseMatrix[Double] = {
        val fSize = data.head.features.length
        DenseMatrix.zeros[Double](fSize, fSize)
      }
    }

    trait ScaledDiagDenseInitializer[L] extends DenseInitializer[L, DenseMatrix[Double]] {
      override def init(data: Iterable[Example[L, DenseVector[Double]]]): DenseMatrix[Double] = {
        val fSize = data.head.features.length
        val scaleDiffs = data.map(_.features.toScalaVector())
          .foldLeft(Seq.fill(fSize)((Double.PositiveInfinity, Double.NegativeInfinity)))(
            (minmax, fv) =>
              minmax.zip(fv).map(
              {
                case ((min, max), fvVal) => if (fvVal < min) (fvVal, max)
                else if (fvVal > max) (min, fvVal)
                else (min, max)
              }))
          .map({ case (min, max) => 1.0 / (max - min)})
        diag(DenseVector(scaleDiffs: _*))
      }
    }

  }

}
