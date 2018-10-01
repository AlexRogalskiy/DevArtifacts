#include <QtCore>
#include <QtNetwork>
#include "connectionthread.h"

ConnectionThread::ConnectionThread(int socketDescriptor, QObject* parent)
  : QThread(parent), socketDescriptor(socketDescriptor)
{
}
void ConnectionThread::run()
{
  QTcpSocket tcpSocket;
  if (!tcpSocket.setSocketDescriptor(socketDescriptor)) {
    qWarning("ERROR: %s", qPrintable(tcpSocket.errorString()));
    return;
  }
  QDateTime time = QDateTime::currentDateTime();
  tcpSocket.write(time.toString(Qt::ISODate).toUtf8());

  forever {
    if (!tcpSocket.waitForReadyRead(10*1000)) {
      tcpSocket.write("ERROR: Timeout while waiting for ACK\n");
      break;
    }
    QString reply = tcpSocket.readAll();
    if (reply.isEmpty()) {
      qWarning("ERROR: %s", qPrintable(tcpSocket.errorString()));
      break;
    } 
    else if ( reply == "ACK\n")
      break;
    else
      tcpSocket.write("ERROR: Invalid command\n");
  }

  tcpSocket.disconnectFromHost();
  if (!tcpSocket.waitForDisconnected(1000))
    qWarning("WARNING: Could not disconnect");

}
