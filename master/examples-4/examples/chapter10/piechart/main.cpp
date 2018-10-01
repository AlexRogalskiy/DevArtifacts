#include <QtGui>
#include "piewidget.h"

int main(int argc, char* argv[])
{
  QApplication app(argc, argv);
  PieWidget w;
  w.addEntry("Choice 1", 50);
  w.addEntry("Choice 2", 40);
  w.addEntry("Choice 3", 60);
  w.addEntry("Choice 4", 70);
  w.show();
  return app.exec();
}
