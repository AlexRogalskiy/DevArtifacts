#include <QtCore>
#include "timeserver.h"

int main(int argc, char* argv[])
{
  QCoreApplication app(argc, argv);
  TimeServer ts;
  ts.listen(QHostAddress::Any, 4711);
  return app.exec();
}
