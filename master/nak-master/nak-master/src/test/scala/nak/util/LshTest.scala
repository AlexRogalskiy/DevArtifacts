package nak.util

import org.junit.runner.RunWith
import org.scalatest.FunSpec
import org.scalatest.junit.JUnitRunner

/**
 * Test LocalitySensitiveHash using Twitter data.
 */
@RunWith(classOf[JUnitRunner])
class LocalitySensitiveHashSpec extends FunSpec {

    describe("Locality Sensitive Hash") {
    val tweets = this.getClass.getResourceAsStream(
      "/data/twitter/example_tweets.txt")

    it ("should index and find near matches") {
      val lines = io.Source.fromInputStream(tweets).getLines.toIndexedSeq
      
      // Hash all all documents read from file
      val lsh = new LocalitySensitiveHash(lines, shingleLength=4)
      
      // find the documents that are most similar to the below string
      val testString = "RT @Adam_Schefter:QB Tebow broke the combined record for QBs with a 38-inch vertical jump. He also ran an impressive 40 time "
      
      val matchingIds = lsh.findSimilar(testString).toList.sorted

      assert(matchingIds === List(34,193,851))
    }
  }

}

