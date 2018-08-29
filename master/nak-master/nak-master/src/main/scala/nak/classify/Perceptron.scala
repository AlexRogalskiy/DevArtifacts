package nak.classify

import nak.data.Example
import breeze.math.{MutableTensorField, MutableVectorField, MutableInnerProductVectorSpace, MutableInnerProductModule}
import breeze.linalg.{argmax, SparseVector, Counter}
import breeze.util.Index
import scala.reflect.ClassTag

object Perceptron {

  class Trainer[L, T](maxPasses: Int = 20)(
    implicit vspace: MutableVectorField[T, Double],
    man: ClassTag[T]) extends Classifier.Trainer[L, T] {

    import vspace._

    type MyClassifier = LinearClassifier[L, UnindexedLFMatrix[L, T], Counter[L, Double], T]

    def train(data: Iterable[Example[L, T]]) = {
      val labelIndex = Index(data.map(_.label))
      val weights = new LFMatrix[L, T](zeroLike(data.head.features), labelIndex)
      weights(data.head.label); // seed with one label
      val result: MyClassifier = new LinearClassifier[L, UnindexedLFMatrix[L, T], Counter[L, Double], T](
        weights.unindexed, Counter[L, Double]())
      for (i <- 0 until maxPasses; ex <- data) {
        val l: L = ex.label
        val feats = ex.features
        val ctr = result.scores(feats)
        if (ctr.size == 0 || argmax(ctr) != l) {
          weights(l) += feats
          if (ctr.size != 0) {
            weights(argmax(ctr)) -= feats
          }
        }
      }
      result
    }
  }

  class AveragedTrainer[L, T](maxPasses: Int = 20)
                             (implicit vspace: MutableVectorField[T, Double],
                              man: ClassTag[T]) extends Classifier.Trainer[L, T] {

    import vspace._

    type MyClassifier = LinearClassifier[L, UnindexedLFMatrix[L, T], Counter[L, Double], T]

    def train(data: Iterable[Example[L, T]]) = {
      val labelIndex = Index(data.map(_.label))
      val weights = new LFMatrix[L, T](zeroLike(data.head.features), labelIndex)
      val avgWeights = new LFMatrix[L, T](zeroLike(data.head.features), labelIndex)
      weights(data.head.label); // seed with one label
      avgWeights(data.head.label); // seed with one label
      import LFMatrix._
      val result: MyClassifier = new LinearClassifier[L, UnindexedLFMatrix[L, T], Counter[L, Double], T](
        weights.unindexed, Counter[L, Double]())
      for (i <- 0 until maxPasses; ex <- data) {
        val l: L = ex.label
        val feats = ex.features
        val ctr = result.scores(feats)
        if (ctr.size == 0 || argmax(ctr) != l) {
          weights(l) += feats
          avgWeights(l) += (feats * i.toDouble)
          if (ctr.size != 0) {
            weights(argmax(ctr)) -= feats
            avgWeights(argmax(ctr)) -= (feats * i.toDouble)
          }
        }
      }
      weights -= (avgWeights :* (1.0 / maxPasses))
      result
    }
  }

}

