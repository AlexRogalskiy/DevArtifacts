package stream

import akka.actor.ActorSystem
import akka.stream.scaladsl.{Keep, Sink, Source}
import akka.stream.{ActorFlowMaterializer, OverflowStrategy}
import com.typesafe.config.ConfigFactory
import model.TweetInfo
import play.api.Logger
import twitter4j.conf.ConfigurationBuilder
import twitter4j.{Status => TwitterStatus, _}


object TwitterStreamListener {

  implicit val system = ActorSystem("mixedTweets")
  implicit val materializer = ActorFlowMaterializer()

  val config = ConfigFactory.load()

  val searchQuery = Array("java", "scala", "haskell")

  val cb = new ConfigurationBuilder()

  cb.setDebugEnabled(true)
    .setOAuthConsumerKey(config.getString("twitter-oauth.consumer-key"))
    .setOAuthConsumerSecret(config.getString("twitter-oauth.consumer-secret"))
    .setOAuthAccessToken(config.getString("twitter-oauth.access-token"))
    .setOAuthAccessTokenSecret(config.getString("twitter-oauth.access-token-secret"))

  val query = new FilterQuery(0, Array[Long](), searchQuery)

  val twitterStream = new TwitterStreamFactory(cb.build).getInstance

  def listenAndStream = {
    val (actorRef, publisher) = Source.actorRef[TweetInfo](1000, OverflowStrategy.fail).toMat(Sink.publisher)(Keep.both).run()

    val statusListener = new StatusAdapter() {

      override def onStatus(status: TwitterStatus) = {
       Logger.debug(status.getText)
       actorRef ! TweetInfo(status.getText, status.getUser.getName)
      }

      override def onException(ex: Exception) = ex.printStackTrace()

    }

    twitterStream.addListener(statusListener)
    twitterStream.filter(query)

    Source(publisher)
  }

}
