#include <QtGui>
#include <QDebug>
#include "timeserver.h"
#include "loggerthread.h"

int main(int argc, char* argv[])
{
  QApplication app(argc, argv);
  QTextBrowser logWindow;
  logWindow.setWindowTitle(QTextBrowser::tr("Log window"));
  TimeServer ts;
  LoggerThread logger("timeserver.log");
  QObject::connect(&ts, SIGNAL(message(const QString&)),
     &logger, SLOT(append(const QString&)));
  QObject::connect(&app, SIGNAL(lastWindowClosed()),
     &logger, SLOT(quit()));
  QObject::connect(&ts, SIGNAL(message(const QString&)),
     &logWindow, SLOT(append(const QString&)));
  if (!ts.listen(QHostAddress::Any, 4711))
    qWarning("Server cannot listen on port 4711!\n");
  logWindow.show();
  return app.exec();
}

