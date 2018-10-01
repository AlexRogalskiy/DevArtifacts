#include <QtCore>
#include <QtNetwork>

#include "timeserver.h"
#include "connectionhandler.h"

TimeServer::TimeServer(QObject *parent)
  : QTcpServer(parent)
{
  connect(this, SIGNAL(newConnection()), 
		SLOT(serveConnection()));
}

void TimeServer::serveConnection()
{
   QTcpSocket *socket = nextPendingConnection();
   if (!socket) 
     return;
   new ConnectionHandler(socket);
}
