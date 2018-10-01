#include <QtGui>
#include "draglabel.h"

int main( int argc, char* argv[] )
{
  QApplication app( argc, argv );

  if (argc < 2) return 1;
  
  DragLabel w(argv[1]);
  w.setWindowTitle(QObject::tr("Drag me!"));
  w.show();

  return app.exec();
}
