#include <QtCore>
#include <QtNetwork>

#include "timeserver.h"
#include "connectionthread.h"

TimeServer::TimeServer(QObject *parent)
  : QTcpServer(parent)
{
}

void TimeServer::incomingConnection(int socketDescriptor)
{
  ConnectionThread *thread = new ConnectionThread(socketDescriptor);
  connect(thread, SIGNAL(message(const QString&)), 
                  SIGNAL(message(const QString&)));
  connect(thread, SIGNAL(finished()), thread, SLOT(deleteLater()));
  thread->start();
}
