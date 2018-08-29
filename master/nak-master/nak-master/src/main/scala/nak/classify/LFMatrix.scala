package nak.classify

import breeze.linalg.support.CanTraverseValues.ValuesVisitor
import breeze.util.{Encoder, Index}
import breeze.linalg._
import breeze.linalg.operators._
import breeze.linalg.support._
import breeze.generic._
import nak.serialization.DataSerialization
import nak.serialization.DataSerialization.ReadWritable
import breeze.math.{MutableTensorField, VectorField, MutableVectorField, Field}
import scala.collection.Set
import scala.reflect.ClassTag

/**
 * This stupidly named class is a Label-Feature Matrix, which is to say that
 * it's a the weight matrix used by most of the classifier trainers. It's
 * basically a matrix with one row per label, and the rows are some Tensor type (TF).
 * TF is a mnemonic for Feature Tensor.
 *
 * @param data array of weights for each label
 * @param emptyTF an empty weight vector, used for creating zeros dense vectors
 * @param labelIndex label index
 * @tparam L label type
 * @tparam TF feature tensor type
 */
@SerialVersionUID(1L)
class LFMatrix[L,TF:ClassTag](val data: Array[TF],
                              emptyTF: =>TF,
                              val labelIndex:Index[L]) extends NumericOps[LFMatrix[L,TF]] with Serializable {
  def this(emptyTF: => TF, labelIndex: Index[L]) = this(Array.fill(labelIndex.size)(emptyTF), emptyTF, labelIndex)

  def repr = this
  def numLabels = labelIndex.size

  def empty = new LFMatrix[L,TF](emptyTF, labelIndex)

  def apply(label: L) = {
    val i = labelIndex(label)
    data(i)
  }

  def apply(label: Int) = {
    data(label)
  }

  def update(label: L, tf: TF) = {
    data(labelIndex(label)) = tf
  }

  def update(label: Int, tf: TF) = {
    data(label) = tf
  }

//  def size: Int = numLabels
//
//  def activeSize: Int = numLabels
//
//  def activeIterator: Iterator[(L, TF)] = labelIndex.pairs.map(li => (li._1,data(li._2)))
//
//  def activeKeysIterator: Iterator[L] = labelIndex.iterator
//
//  def keysIterator: Iterator[L] = labelIndex.iterator
//
//  def activeValuesIterator: Iterator[TF] = data.iterator
//
//  def iterator: Iterator[(L, TF)] = labelIndex.pairs.map(li => (li._1,data(li._2)))
//
//  def valuesIterator: Iterator[TF] = data.iterator
//
//  def keySet: Set[L] = labelIndex.pairs.map(_._1).toSet

  override def toString = {
    data.mkString("Weight Matrix{\n  ","\n  ","\n}")
  }

  def unindexed = new UnindexedLFMatrix(this)

}

object LFMatrix {
  implicit def lfMatrixTimesTF[L,TF]
  (implicit inner: OpMulInner.Impl2[TF,TF,Double], numeric: TF=>NumericOps[TF])
  : OpMulMatrix.Impl2[LFMatrix[L,TF],TF,DenseVector[Double]]  = {
    new OpMulMatrix.Impl2[LFMatrix[L,TF],TF,DenseVector[Double]] {

      def apply(v1: LFMatrix[L, TF], v2: TF) = {
        val r = DenseVector.zeros[Double](v1.numLabels)
        for( i <- 0 until r.length) {
          r(i) = v1.data(i) dot v2
        }
        r
      }
    }
  }

  implicit def lfBinaryOp[L,TF,Op<:OpType]
  (implicit op: UFunc.UImpl2[Op, TF,Double,TF], numeric: TF=>NumericOps[TF])
  : UFunc.UImpl2[Op, LFMatrix[L,TF],Double,LFMatrix[L,TF]]  = {
    new UFunc.UImpl2[Op, LFMatrix[L,TF],Double,LFMatrix[L,TF]] {

      def apply(v1: LFMatrix[L, TF], v2: Double) = {
        val r = v1.empty
        for( (tf,l) <- v1.data.zipWithIndex) {
          r(l) = op(tf,v2)
        }
        r
      }
    }
  }

  implicit def lfbinaryOpBackwards[L,TF,Op<:OpType]
  (implicit op: UFunc.UImpl2[Op, Double,TF,TF], numeric: TF=>NumericOps[TF])
  : UFunc.UImpl2[Op, Double,LFMatrix[L,TF],LFMatrix[L,TF]]  = {
    new UFunc.UImpl2[Op, Double,LFMatrix[L,TF],LFMatrix[L,TF]] {

      def apply(v2: Double, v1: LFMatrix[L, TF]) = {
        val r = v1.empty
        for( (tf, l) <- v1.data.zipWithIndex) {
          r(l) = op(v2,tf)
        }
        r
      }
    }
  }

  implicit def lfBinaryTFOp[L,TF,Op<:OpType]
  (implicit op: UFunc.UImpl2[Op, TF,TF,TF], numeric: TF=>NumericOps[TF])
  : UFunc.UImpl2[Op, LFMatrix[L,TF],LFMatrix[L,TF],LFMatrix[L,TF]]  = {
    new UFunc.UImpl2[Op, LFMatrix[L,TF],LFMatrix[L,TF],LFMatrix[L,TF]] {

      def apply(v2: LFMatrix[L,TF], v1: LFMatrix[L, TF]) = {
        val r = v1.empty
        require(v2.labelIndex == v1.labelIndex, "Indices must be the same!")
        for( (tf, l) <- v1.data.zipWithIndex) {
          r(l) = op(v2(l),tf)
        }

        r
      }
    }
  }

  implicit def lfInnerOp[L,TF]
  (implicit op: OpMulInner.Impl2[TF,TF,Double], numeric: TF=>NumericOps[TF])
  : OpMulInner.Impl2[LFMatrix[L,TF],LFMatrix[L,TF],Double]  = {
    new OpMulInner.Impl2[LFMatrix[L,TF],LFMatrix[L,TF],Double] {
      def apply(v2: LFMatrix[L,TF], v1: LFMatrix[L, TF]) = {
        var r = 0.0
        for( (tf, l) <- v1.data.zipWithIndex) {
          r += op(v2(l),tf)
        }

        r
      }
    }
  }

  implicit def lfBinaryOp2[L,TF,Op]
  (implicit op: UFunc.UImpl2[OpMulScalar.type, TF, Double,TF], numeric: TF=>NumericOps[TF])
  : UFunc.UImpl2[OpMulScalar.type, LFMatrix[L,TF], Double,LFMatrix[L,TF]]  = {
    new UFunc.UImpl2[OpMulScalar.type, LFMatrix[L,TF],Double, LFMatrix[L,TF]] {

      def apply(v1: LFMatrix[L, TF], v2: Double) = {
        val r = v1.empty
        for( (tf, l) <- v1.data.zipWithIndex) {
          r(l) = tf.:*(v2)(op)
        }
        r
      }
    }
  }

  implicit def lfUpdateOp[L,TF,Op<:OpType]
  (implicit op: UFunc.InPlaceImpl2[Op, TF,Double], numeric: TF=>NumericOps[TF])
  : UFunc.InPlaceImpl2[Op, LFMatrix[L,TF],Double]  = {
    new UFunc.InPlaceImpl2[Op, LFMatrix[L,TF], Double] {

      def apply(v1: LFMatrix[L, TF], v2: Double) {
        for( tf <- v1.data) {
          op(tf,v2)
        }
      }
    }
  }

  implicit def lfBinaryTFUpdateOp[L,TF,Op<:OpType]
  (implicit op: UFunc.InPlaceImpl2[Op, TF,TF], numeric: TF=>NumericOps[TF])
  :  UFunc.InPlaceImpl2[Op, LFMatrix[L,TF],LFMatrix[L,TF]]  = {
    new  UFunc.InPlaceImpl2[Op, LFMatrix[L,TF],LFMatrix[L,TF]] {
      def apply(v2: LFMatrix[L,TF], v1: LFMatrix[L, TF]) {
        require(v2.labelIndex == v1.labelIndex)
        for( (tf, l) <- v1.data.zipWithIndex) {
          op(v2(l),tf)
        }

      }
    }
  }

  implicit def lfAxpyOp[L,TF]
  (implicit op: scaleAdd.InPlaceImpl3[TF, Double, TF], numeric: TF=>NumericOps[TF])
  : scaleAdd.InPlaceImpl3[LFMatrix[L,TF], Double, LFMatrix[L,TF]]  = {
    new scaleAdd.InPlaceImpl3[LFMatrix[L,TF], Double, LFMatrix[L,TF]]  {
      def apply(v2: LFMatrix[L,TF], a: Double, v1: LFMatrix[L, TF]) {
        require(v2.labelIndex == v1.labelIndex)
        for( (tf, l) <- v1.data.zipWithIndex) {
          op(v2(l), a, tf)
        }

      }
    }
  }

  implicit def lfUnaryOp[L,TF,Op<:OpType]
  (implicit op: UFunc.UImpl[Op, TF, TF], numeric: TF=>NumericOps[TF])
  : UFunc.UImpl[Op, LFMatrix[L,TF], LFMatrix[L, TF]]  = {
    new UFunc.UImpl[Op, LFMatrix[L,TF], LFMatrix[L, TF]] {
      def apply(v1: LFMatrix[L, TF]) = {
        val r = v1.empty
        for( (tf, l) <- v1.data.zipWithIndex) {
          r(l) = op(tf)
        }
        r
      }
    }
  }

  implicit def lfNorm[L,TF](implicit op: norm.Impl2[TF, Double, Double]) : norm.Impl2[LFMatrix[L,TF], Double, Double] = {
    new norm.Impl2[LFMatrix[L,TF], Double, Double] {
      def apply(v1: LFMatrix[L, TF], v2: Double) = {
        math.pow(v1.data.iterator.map(op.apply(_,v2)).map(math.pow(_,v2)).sum, 1/v2)
      }
    }
  }

  implicit def canMapValues[L,TF, V](implicit cmf: CanMapValues[TF,V,V,TF]) = new CanMapValues[LFMatrix[L,TF],V,V,LFMatrix[L,TF]] {
    def mapActive(from: LFMatrix[L, TF], fn: (V) => V) = {
      val r = from.empty
      for( (tf, l) <- from.data.zipWithIndex) {
        r(l) = cmf.mapActive(tf,fn)
      }
      r
    }

    def map(from: LFMatrix[L, TF], fn: (V) => V) = {
      val r = from.empty
      for( (tf, l) <- from.data.zipWithIndex) {
        r(l) = cmf.map(tf,fn)
      }
      r
    }
  }

  implicit def canTraverseValues[L,TF,V](implicit iterVals: CanTraverseValues[TF,V]) = new CanTraverseValues[LFMatrix[L,TF],V] {
    def traverse(from: LFMatrix[L, TF], fn: ValuesVisitor[V]): Unit =
      from.labelIndex.foreach(l => iterVals.traverse(from(l),fn))
    def isTraversableAgain(from: LFMatrix[L, TF]): Boolean = true
  }


  implicit def canZipMapValues[L,TF, S](implicit cmf: CanZipMapValues[TF,S,S,TF]) = new CanZipMapValues[LFMatrix[L,TF],S,S,LFMatrix[L,TF]] {
    def map(from: LFMatrix[L, TF], other: LFMatrix[L, TF], fn: (S, S) => S) = {
      val r = from.empty
      for( (tf, l) <- from.data.zipWithIndex) {
        r(l) = cmf.map(tf, other(l), fn)
      }
      r
    }
  }

  implicit def canCopy[L,TF](implicit copy: CanCopy[TF]) = new CanCopy[LFMatrix[L,TF]] {
    def apply(from: LFMatrix[L, TF]) = {
      val r = from.empty
      for( (v, l) <- from.data.zipWithIndex) {
        r(l) = copy(v)
      }
      r
    }
  }

  implicit def canCreateZerosLike[L,TF](implicit zeros: CanCreateZerosLike[TF, TF]) = new CanCreateZerosLike[LFMatrix[L, TF], LFMatrix[L,TF]] {
    def apply(from: LFMatrix[L, TF]) = {
      val r = from.empty
      for( (v, l) <- from.data.zipWithIndex) {
        r(l) =zeros(v)
      }
      r
    }
  }

  implicit def lfReadWritable[L,TF](implicit formatL: DataSerialization.ReadWritable[L],
                                    formatTF: DataSerialization.ReadWritable[TF],
                                    zeros: CanCreateZerosLike[TF,TF], man: Manifest[TF]) = {
     new ReadWritable[LFMatrix[L,TF]] {
       def write(sink: DataSerialization.Output, what: LFMatrix[L,TF]) = {
         DataSerialization.write(sink, what.labelIndex)
         DataSerialization.write(sink, what.data)(DataSerialization.arrayReadWritable[TF])
       }

       def read(source: DataSerialization.Input) = {
         val index = DataSerialization.read[Index[L]](source)
         val map = DataSerialization.read[Array[TF]](source)(DataSerialization.arrayReadWritable[TF])
         def default = zeros(map.head)
         val ret = new LFMatrix[L,TF](map, default, index)
         ret
       }
     }
   }

  implicit def space[L, TF](implicit vspace: MutableVectorField[TF, Double]) = {
    import vspace._
    MutableVectorField.make[LFMatrix[L,TF], Double]
  }


}

/**
 * This is the unindexed weights matrix: it acts as a tensor over the label types, rather than
 * their indexed components
 */
@SerialVersionUID(1L)
class UnindexedLFMatrix[L,TF](val indexed: LFMatrix[L, TF])  extends NumericOps[UnindexedLFMatrix[L,TF]] with Serializable {
  def repr: UnindexedLFMatrix[L, TF] = this

  def labelIndex = indexed.labelIndex
}

object UnindexedLFMatrix {
  implicit def ulfMatrixTimesTF[L,TF]
  (implicit inner: OpMulMatrix.Impl2[ LFMatrix[L, TF], TF, DenseVector[Double]], numeric: TF=>NumericOps[TF])
  : OpMulMatrix.Impl2[UnindexedLFMatrix[L,TF],TF,Counter[L, Double]]  = {
    new OpMulMatrix.Impl2[UnindexedLFMatrix[L,TF],TF,Counter[L, Double]] {

      def apply(v1: UnindexedLFMatrix[L, TF], v2: TF) = {
        val dv = v1.indexed * v2
        Encoder.fromIndex(v1.labelIndex).decode(dv)
      }
    }
  }
}
