#include <QtGui>

QImage rotateRgb(const QImage &in)
{
  QImage out(in.size(), in.format());
  for(int line = 0; line < in.height(); line++) {
    const QRgb* inPixels = reinterpret_cast<const QRgb*>
					     (in.scanLine(line));
    QRgb* outPixels = reinterpret_cast<QRgb*>(out.scanLine(line));
    for(int pos = 0; pos < in.width(); pos++) {
      int red = qRed(inPixels[pos]);
      int green = qGreen(inPixels[pos]);
      int blue = qBlue(inPixels[pos]);
      int alpha = qAlpha(inPixels[pos]);
      outPixels[pos] = qRgba(blue, red, green, alpha);
    }
  }
  return out;
}
int main(int argc, char* argv[])
{
  QApplication app(argc, argv);
  QImage img("qt.png");
  QLabel rgb;
  img = rotateRgb(img);
  QLabel brg;
  brg.setPixmap(QPixmap::fromImage(img));
  img = rotateRgb(img);
  QLabel grb;
  grb.setPixmap(QPixmap::fromImage(img));
  img = rotateRgb(img);
  rgb.setPixmap(QPixmap::fromImage(img));
  rgb.show();
  brg.show();
  grb.show();
  return app.exec();
}
