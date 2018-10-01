#include <QtGui>
#include "clockwidget.h"

int main(int argc, char* argv[])
{
  QApplication app(argc, argv);

  ClockWidget w;
  w.show();

  return app.exec();
}
