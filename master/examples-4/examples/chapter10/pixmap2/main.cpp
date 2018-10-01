#include <QtGui>

int main(int argc, char* argv[])
{
  QApplication app(argc, argv);
  QRect r(0,0, 100, 100);
  QPixmap pm(r.size());
  pm.fill();

  QPainter p(&pm);
  p.setRenderHint(QPainter::Antialiasing, true);
  QPen pen(Qt::red, 2);
  p.setPen(pen);
  QBrush brush(Qt::blue);
  p.setBrush(brush);
  QRect ri = r.adjusted(10,10,-10,-10);
  p.drawEllipse(ri);
  QLabel l;
  l.setPixmap(pm);
  l.show();
  return app.exec();
}
