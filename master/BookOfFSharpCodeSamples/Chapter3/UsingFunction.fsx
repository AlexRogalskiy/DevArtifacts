open System.Drawing

module Drawing =
  let w, h = using (Image.FromFile(@"C:\Windows\Web\Screen\img100.jpg"))
                   (fun img -> (img.Width, img.Height))
  do
    printfn "Dimensions: %i x %i" w h
