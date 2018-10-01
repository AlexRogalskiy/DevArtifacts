open System.Drawing
open System.IO

type IImageAdapter =
  abstract member PixelDimensions : SizeF with get
  abstract member VerticalResolution : int with get
  abstract member HorizontalResolution : int with get
  abstract member GetRawData : unit -> Stream
