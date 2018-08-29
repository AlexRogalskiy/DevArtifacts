case class Book(title: String)

object BookExtension {

  implicit class Ops(book: Book) {
    def categorize(category: String) = s"$book, category: $category"
  }

}

import BookExtension._

println(Book("Dracula") categorize "Vampire")