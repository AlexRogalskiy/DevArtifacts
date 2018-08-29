package nak.data

import collection.mutable.ArrayBuffer
;

/*
 Copyright 2009 David Hall, Daniel Ramage
 
 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at 
 
 http://www.apache.org/licenses/LICENSE-2.0
 
 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License. 
*/


/**
* Provides useful utilties for dealing with datasets that have a defined order.
*
* @author dlwh
*/
object Datasets {
  /**
  * Split a training set into k-folds, with a test sets equal to
  * 1/kth of the data and training sets the rest of it. Returns a IndexedSeq of results,
  * one for each execution.
  *
  * Syntax: crossValidate(K, myDataSet)( (trainSet,testSet) =&gt; {produce a result} ) 
  */
  def crossValidate[T, R](k : Int, dataset: IndexedSeq[T])(f: (IndexedSeq[T], IndexedSeq[T])=>R): IndexedSeq[R] = {
    require(k < dataset.size);
    require(k > 0);
    val chunkSize = dataset.size/k;
    val result = new ArrayBuffer[R];
    for(i <- 0 until k) {
      val testSet = dataset.slice(i * chunkSize, (i+1)*chunkSize min dataset.size)
      val trainSet =  (dataset.slice(0,i * chunkSize)) ++ (dataset.view( (i+1)* chunkSize,dataset.size))
      result += f(trainSet,testSet);
    }
    result
  }

  /**
  * Leave-one-out Cross validation
  * Split a training set into dataset.size-folds, with a test sets equal to
  * 1 of the data and training sets for the rest of it. Returns a IndexedSeq of results,
  * one for each execution.
  *
  * This is probably very slow!
  *
  * Syntax: loocv(myDataSet)( (trainSet,testSet) => {produce a result} ) 
  */
  def loocv[T](dataset: IndexedSeq[T]) = new {
    def apply[R](f: (IndexedSeq[T], IndexedSeq[T])=>R): IndexedSeq[R] = {
      val result = new ArrayBuffer[R];
      for(i <- 0 until dataset.size) {
        val testSet = dataset drop (i) take 1;
        val trainSet = (dataset take i) ++ (dataset drop (i+1));
          result += f(trainSet,testSet);
      }
      result
    }
  }

}
