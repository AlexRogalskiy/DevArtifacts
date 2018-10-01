#include <QtGui>
#include "droplabel.h"

int main( int argc, char* argv[] )
{
  QApplication app( argc, argv );

  DropLabel w;
  w.setWindowTitle(QObject::tr("Drop here!"));
  w.resize(100,100);
  w.show();

  return app.exec();
}
