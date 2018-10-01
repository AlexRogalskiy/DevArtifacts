#include <QtGui>

int main(int argc, char* argv[])
{
  QApplication app(argc, argv);
  QPixmap pm(100,100);
  pm.fill();

  QPainter p(&pm);
  p.setRenderHint(QPainter::Antialiasing, true);
  QPen pen(Qt::blue, 2);
  p.setPen(pen);
  QBrush brush(Qt::green);
  p.setBrush(brush);
  p.drawEllipse(10, 10, 80,80);
  QLabel l;
  l.setPixmap(pm);
  l.show();
  return app.exec();
}
