#include <QtGui>
#include "d2clabel.h"

int main( int argc, char* argv[] )
{
  QApplication app( argc, argv );

  D2cLabel w;
  w.resize(400, 150);
  w.setWindowTitle(QObject::tr("Drag2Clip"));
  w.show();

  return app.exec();
}

