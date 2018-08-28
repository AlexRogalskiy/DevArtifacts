package controllers

import akka.actor._
import akka.stream.scaladsl._
import akka.stream.{ActorFlowMaterializer, FlowMaterializer}
import model.TweetInfo
import org.reactivestreams._
import play.api.libs.EventSource
import play.api.libs.iteratee._
import play.api.libs.json.{JsValue, Json}
import play.api.libs.streams.Streams
import play.api.mvc.{Action, Controller}
import stream.TwitterStreamListener


object MainController extends Controller {

  def sourceToEnumerator[Out, Mat](source: Source[Out, Mat])(implicit fm: FlowMaterializer): Enumerator[Out] = {
    val pubr: Publisher[Out] = source.runWith(Sink.publisher[Out])
    Streams.publisherToEnumerator(pubr)
  }

  def stream() = Action {

    implicit val system = ActorSystem("mixedTweets")
    implicit val materializer = ActorFlowMaterializer()

    val toJson = (tweet: TweetInfo) => Json.obj("message" -> s"${tweet.message}", "author" -> s"${tweet.author}")

    val streams = Seq(TwitterStreamListener.listenAndStream)

    val mergedStream = Source[TweetInfo]() { implicit builder =>
      import FlowGraph.Implicits._

      val merge = builder.add(Merge[TweetInfo](streams.length))

      for (i <- streams.indices) {
        builder.addEdge(builder.add(streams(i)), merge.in(i))
      }

      merge.out
    }

    val jsonStream = mergedStream.map(tweets => toJson(tweets))

    val jsonEnumerator : Enumerator[JsValue] = sourceToEnumerator(jsonStream)

    Ok.chunked(jsonEnumerator through EventSource()).as("text/event-stream")
  } 

  def index() = Action {
    Ok(views.html.index())
  }
  
}