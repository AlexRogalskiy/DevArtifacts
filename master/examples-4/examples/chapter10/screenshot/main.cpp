#include <QtGui>
#include "grabdialog.h"

int main(int argc, char* argv[])
{
  QApplication app(argc,argv);
  GrabDialog dialog;
  dialog.show();
  return app.exec();
}
