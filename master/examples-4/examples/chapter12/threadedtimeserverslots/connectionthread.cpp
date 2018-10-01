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
    emit message("ERROR: "+ tcpSocket.errorString());
    return;
  }
  QByteArray error;
  QString peerHostName = tcpSocket.peerAddress().toString();
  emit message("INFO: "+ peerHostName + " connected.");
  QDateTime time = QDateTime::currentDateTime();
  tcpSocket.write(time.toString(Qt::ISODate).toUtf8());

  forever {
    if (!tcpSocket.waitForReadyRead(10*1000)) {
      error = "ERROR: Timeout while waiting for ACK";
      tcpSocket.write(error+"\n");
      emit message(peerHostName+": " + error);
      break;
    }
    QByteArray reply = tcpSocket.readAll();
    if ( reply != "ACK\n") {
      error = "ERROR: Invalid command: " + reply.simplified() ;
      tcpSocket.write(error+"\n");
      emit message(peerHostName+": " + error);
    }
    else
      break;
  }

  tcpSocket.disconnectFromHost();
}
