type Markup =
| ContentElement of string * Markup list
| EmptyElement of string
| Content of string

let movieList =
  ContentElement("html",
    [ ContentElement("head", [ ContentElement("title", [ Content "Guilty Pleasures" ])])
      ContentElement("body",
        [ ContentElement("article",
            [ ContentElement("h1", [ Content "Some Guilty Pleasures" ])
              ContentElement("p",
                [ Content "These are "
                  ContentElement("strong", [ Content "a few" ])
                  Content " of my guilty pleasures" ])
              ContentElement("ul",
                [ ContentElement("li", [ Content "Crank (2006)" ])
                  ContentElement("li", [ Content "Starship Troopers (1997)" ])
                  ContentElement("li", [ Content "RoboCop (1987)" ])])])])])

let rec toHtml markup =
  match markup with
  | ContentElement (tag, children) ->
      use w = new System.IO.StringWriter()
      children
        |> Seq.map toHtml
        |> Seq.iter (fun (s : string) -> w.Write(s))
      sprintf "<%s>%s</%s>" tag (w.ToString()) tag
  | EmptyElement (tag) -> sprintf "<%s />" tag
  | Content (c) -> sprintf "%s" c

movieList |> toHtml
