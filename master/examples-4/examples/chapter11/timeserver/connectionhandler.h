#ifndef CONNECTIONHANDLER_H
#define CONNECTIONHANDLER_H

#include <QtCore>
#include <QtNetwork>
#include <QDebug>

class ConnectionHandler : public QObject
{
  Q_OBJECT
  private:
    QTcpSocket *socket;
  public:
    ConnectionHandler(QTcpSocket *socket, QObject *parent=0)
      : QObject(parent)
    {
      QString dt = QDateTime::currentDateTime().toString(Qt::ISODate);
      socket->write(dt.toUtf8());
      connect(socket, SIGNAL(readyRead()), SLOT(confirm()));
      QTimer::singleShot(10000, this, SLOT(timeout()));
      this->socket = socket;
    }

  protected:
    void closeConnection() { 
      socket->close();
      delete socket;
      deleteLater();
    }

  protected slots:
    void timeout() {
       socket->write("ERROR: Timeout while waiting for acknowledgement\n");
       closeConnection();
    }
    void confirm() 
    {
      QByteArray reply = socket->readAll();
      if(reply == "ACK\n")
        closeConnection();
      else
        socket->write("ERROR: Unknown command\n");
    }

};

#endif // CONNECTIONHANDLER_H
