#include <QtGui>
#include "byteconverterdialog.h"

int main(int argc, char*argv[])
{
  QApplication app(argc, argv);
  ByteConverterDialog dlg;
  dlg.setAttribute(Qt::WA_QuitOnClose);
  dlg.show();
  return app.exec();
}
