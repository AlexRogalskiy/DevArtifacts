#include <QtGui>
#include "chatwindow.h"

int main(int argc, char* argv[])
{
   QApplication app(argc, argv);
   ChatWindow win;
   win.show();
   return app.exec();
}
