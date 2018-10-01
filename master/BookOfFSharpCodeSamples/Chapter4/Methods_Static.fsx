open System.IO

[<AbstractClass>]
type ImageReader() =
  abstract member Dimensions : int * int with get
  abstract member Resolution : int * int with get
  abstract member Content : byte array with get

type JpgImageReader(fileName : string) =
  inherit ImageReader()
  override x.Dimensions with get() = (0, 0)
  override x.Resolution with get() = (0, 0)
  override x.Content with get() = Array.empty<byte>

type GifImageReader(fileName : string) =
  inherit ImageReader()
  override x.Dimensions with get() = (0, 0)
  override x.Resolution with get() = (0, 0)
  override x.Content with get() = Array.empty<byte>

type PngImageReader(fileName : string) =
  inherit ImageReader()
  override x.Dimensions with get() = (0, 0)
  override x.Resolution with get() = (0, 0)
  override x.Content with get() = Array.empty<byte>

[<Sealed>]
type ImageReaderFactory private() =
  static member CreateReader(fileName) =
    let fi = FileInfo(fileName)
    match fi.Extension.ToUpper() with
    | ".JPG" -> JpgImageReader(fileName) :> ImageReader
    | ".GIF" -> GifImageReader(fileName) :> ImageReader
    | ".PNG" -> PngImageReader(fileName) :> ImageReader
    | ext -> failwith (sprintf "Unsupported extension: %s" ext)

ImageReaderFactory.CreateReader "MyPicture.jpg"
ImageReaderFactory.CreateReader "MyPicture.gif"
ImageReaderFactory.CreateReader "MyPicture.png"
ImageReaderFactory.CreateReader "MyPicture.targa"
