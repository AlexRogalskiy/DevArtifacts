#include <QtGui>
#include "rotationwidget.h"

int main(int argc, char* argv[])
{
  QApplication app(argc, argv);
  RotationWidget w;
  w.show();
  return app.exec();
}
