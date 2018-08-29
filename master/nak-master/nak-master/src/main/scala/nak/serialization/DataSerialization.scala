/*
 Copyright 2009 David Hall, Daniel Ramage

 Licensed under the Apache License, Version 2.0 (the "License")
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
*/
package nak.serialization

import java.io.File
import java.io.{ByteArrayInputStream,ByteArrayOutputStream}
import java.io.{DataInput,DataInputStream,DataOutput,DataOutputStream}
import java.io.{ObjectInputStream,ObjectOutputStream}

import scala.collection.mutable.Builder
import breeze.collection.mutable.SparseArray
import scala.reflect.ClassTag

/**
 * File-backed Serialization with standard combinators using optimized
 * binary formats where able, default Java serialization otherwise.
 * 
 * @author dlwh
 * @author dramage
 */
object DataSerialization extends SerializationFormat
with SerializationFormat.PrimitiveTypes with SerializationFormat.CompoundTypes
with ByteSerialization {
  type Input = DataInput
  type Output = DataOutput

  //
  // From ByteSerialization
  // 

  /**
   * Marshalls the object using the implicit Handler to a byte array
   * Usage: DataSerialization.toBytes(myData)
   */
  override def toBytes[T:Writable](x: T) = {
    val bout = new ByteArrayOutputStream()
    val out = new DataOutputStream(bout)
    implicitly[Writable[T]].write(out,x)
    out.close
    bout.toByteArray
  }

  /**
   * Unmarshalls the object using the implicit Handler
   * Usage: DataSerialization.fromBytes[T](bytes)
   */
  override def fromBytes[T:Readable](bytes: Array[Byte]) = {
    val in = new DataInputStream(new ByteArrayInputStream(bytes))
    val x = implicitly[Readable[T]].read(in)
    in.close
    x
  }

  //
  // From CompoundTypes
  //

  override protected def readName(src : Input) =
    src.readUTF

  override protected def writeName(sink : Output, value : String) =
    sink.writeUTF(value)

  override protected def readBuildable[T:Readable,To]
  (src : Input, builder : Builder[T,To]) : To = {
    val sz = src.readInt
    for(i <- 0 until sz) {
      builder += implicitly[Readable[T]].read(src)
    }
    builder.result
  }

  override protected def writeIterable[T:Writable,CC<:Iterable[T]]
  (sink : Output, coll : CC, name : String) {
    sink.writeInt(coll.size)
    for (e <- coll) implicitly[Writable[T]].write(sink,e)
  }

  //
  // From PrimitiveTypes
  //

  override implicit val intReadWritable = new ReadWritable[Int] {
    def read(in: DataInput) = in.readInt()
    def write(out: DataOutput, t: Int) = out.writeInt(t)
  }

  override implicit val byteReadWritable = new ReadWritable[Byte] {
    def read(in: DataInput) = in.readByte()
    def write(out: DataOutput, t: Byte) = out.writeByte(t)
  }

  override implicit val longReadWritable = new ReadWritable[Long] {
    def read(in: DataInput) = in.readLong()
    def write(out: DataOutput, t: Long) = out.writeLong(t)
  }

  override implicit val shortReadWritable = new ReadWritable[Short] {
    def read(in: DataInput) = in.readShort()
    def write(out: DataOutput, t: Short) = out.writeShort(t)
  }

  override implicit val doubleReadWritable = new ReadWritable[Double] {
    def read(in: DataInput) = in.readDouble()
    def write(out: DataOutput, t: Double) = out.writeDouble(t)
  }

  override implicit val floatReadWritable = new ReadWritable[Float] {
    def read(in: DataInput) = in.readFloat()
    def write(out: DataOutput, t: Float) = out.writeFloat(t)
  }

  override implicit val charReadWritable = new ReadWritable[Char] {
    def read(in: DataInput) = in.readChar()
    def write(out: DataOutput, t: Char) = out.writeChar(t)
  }

  override implicit val stringReadWritable = new ReadWritable[String] {
    def read(in: DataInput) = in.readUTF()
    def write(out: DataOutput, t: String) = out.writeUTF(t)
  }

  override implicit val booleanReadWritable = new ReadWritable[Boolean] {
    def read(in: DataInput) = in.readBoolean
    def write(out: DataOutput, b: Boolean) = out.writeBoolean(b)
  }

  //
  // Builtins
  //

  implicit object ByteArrayReadWritable extends ReadWritable[Array[Byte]] {
    override def read(in : DataInput) = {
      var rv = new Array[Byte](in.readInt)
      var i = 0
      while (i < rv.length) {
        rv(i) = in.readByte()
        i += 1
      }
      rv
    }

    override def write(out : Output, v : Array[Byte]) = {
      out.writeInt(v.length)
      var i = 0
      while (i < v.length) {
        out.writeByte(v(i))
        i += 1
      }
    }
  }

  implicit object IntArrayReadWritable extends ReadWritable[Array[Int]] {
    override def read(in : DataInput) = {
      var rv = new Array[Int](in.readInt)
      var i = 0
      while (i < rv.length) {
        rv(i) = in.readInt()
        i += 1
      }
      rv
    }

    override def write(out : Output, v : Array[Int]) = {
      out.writeInt(v.length)
      var i = 0
      while (i < v.length) {
        out.writeInt(v(i))
        i += 1
      }
    }
  }

  implicit def ArrayReadWritable[T:ReadWritable:ClassTag] = new ReadWritable[Array[T]] {
    override def read(in : DataInput) = {
      var rv = new Array[T](in.readInt)
      var i = 0
      while (i < rv.length) {
        rv(i) = DataSerialization.read[T](in)
        i += 1
      }
      rv
    }

    override def write(out : Output, v : Array[T]) = {
      out.writeInt(v.length)
      var i = 0
      while (i < v.length) {
        DataSerialization.write(out,v(i))
        i += 1
      }
    }
  }

  import breeze.linalg._
  implicit object DenseVectorReadWritable extends ReadWritable[DenseVector[Double]] {
    override def read(in : DataInput) =  {
      val offset = DataSerialization.read[Int](in)
      val stride = DataSerialization.read[Int](in)
      val length = DataSerialization.read[Int](in)
      val data = DataSerialization.read[Array[Double]](in)
      new DenseVector(data, offset,stride,length)
    }

    override def write(out : Output, v : DenseVector[Double]) {
      DataSerialization.write(out,v.offset)
      DataSerialization.write(out,v.stride)
      DataSerialization.write(out,v.length)
      DataSerialization.write(out,v.data)
    }
  }

  implicit object DenseMatrixReadWritable extends ReadWritable[DenseMatrix[Double]] {
    override def read(in : DataInput) =  {
      val rows = DataSerialization.read[Int](in)
      val cols = DataSerialization.read[Int](in)
      new DenseMatrix(rows,cols, DataSerialization.read[Array[Double]](in))
    }

    override def write(out : Output, v : DenseMatrix[Double]) {
      DataSerialization.write(out,v.rows)
      DataSerialization.write(out,v.cols)
      DataSerialization.write(out,v.data)
    }
  }

  implicit object SparseArrayReadWritable extends ReadWritable[SparseArray[Double]] {
    override def read(in : DataInput) = {
      val size = in.readInt()
      val used = in.readInt()
      val index = DataSerialization.read[Array[Int]](in)
      val data = DataSerialization.read[Array[Double]](in)
      new SparseArray[Double](index,data,used,size,used)
    }

    override def write(out : DataOutput, v : SparseArray[Double]) {
      out.writeInt(v.size)
      out.writeInt(v.activeSize)
      DataSerialization.write(out,v.index)
      DataSerialization.write(out,v.data)
    }
  }

  /*
  implicit object SparseVectorReadWritable extends ReadWritable[SparseVector[Double]] {
    override def read(in : DataInput) = {
      val data = DataSerialization.read[SparseArray[Double]](in)
      new SparseVector[Double](data)
    }

    override def write(out : DataOutput, v : SparseVector[Double]) {
      DataSerialization.write(out,v.data)
    }
  }
  */

  /**
   * Uses Java serialization.
   */
  def naiveReadWritable[T] = new ReadWritable[T] {
    def read(in: DataInput) = {
      val ba = ByteArrayReadWritable read in
      val oin = new ObjectInputStream(new ByteArrayInputStream(ba))
      val x = oin.readObject().asInstanceOf[T]
      oin.close()
      x
    }

    def write(out: DataOutput, x: T) {
      val bout = new ByteArrayOutputStream()
      val oout = new ObjectOutputStream(bout)
      oout.writeObject(x)
      oout.close()
      ByteArrayReadWritable.write(out, bout.toByteArray)
    }
  }
}
