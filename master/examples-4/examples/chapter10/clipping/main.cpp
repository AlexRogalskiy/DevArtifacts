#include <QtGui>
#include <paintwidget.h>

int main(int argc, char* argv[])
{
  QApplication app(argc, argv);
  PaintWidget pw;
  pw.show();
  return app.exec();
}
