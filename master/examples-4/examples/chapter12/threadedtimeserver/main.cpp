#include <QtCore>
#include "timeserver.h"

int main(int argc, char* argv[])
{
  QCoreApplication app(argc, argv);
  TimeServer ts;
  if (!ts.listen(QHostAddress::Any, 4711))
    qWarning("Server cannot listen on this port!\n");
  return app.exec();
}
