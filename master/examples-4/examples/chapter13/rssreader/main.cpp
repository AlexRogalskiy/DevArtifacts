#include <QtGui>
#include "mainwindow.h"

int main(int argc, char *argv[])
{
  QApplication app(argc, argv);
  MainWindow mw;
  mw.show();
  mw.resize(640, 480);
  return app.exec();
}
