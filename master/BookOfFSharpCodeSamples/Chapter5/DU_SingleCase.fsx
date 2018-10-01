type HtmlString = | HtmlString of string

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

open System.IO

let rec toHtml markup =
  match markup with
  | ContentElement (tag, children) ->
      use w = new StringWriter()
      children
        |> Seq.map toHtml
        |> Seq.iter (fun (HtmlString(html)) -> w.Write(html))
      HtmlString (sprintf "<%s>%s</%s>" tag (w.ToString()) tag)
  | EmptyElement (tag) -> HtmlString (sprintf "<%s />" tag)
  | Content (c) -> HtmlString (sprintf "%s" c)

let displayHtml (HtmlString(html)) =
  let fn = Path.Combine(Path.GetTempPath(), "HtmlDemo.htm")
  let bytes = System.Text.UTF8Encoding.UTF8.GetBytes html
  using (new FileStream(fn, FileMode.Create, FileAccess.Write))
        (fun fs -> fs.Write(bytes, 0, bytes.Length))
  System.Diagnostics.Process.Start(fn).WaitForExit()
  File.Delete fn

movieList |> toHtml |> displayHtml
