#include <QtGui>

#include "ui_byteconverterdialog.h"

int main(int argc, char*argv[])
{
  QApplication app(argc, argv);
  QDialog dlg;
  Ui::ByteConverterDialog ui;
  ui.setupUi(&dlg);
  dlg.setAttribute(Qt::WA_QuitOnClose);
  dlg.show();
  return app.exec();
}
