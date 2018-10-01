#ifndef TIMESERVER_H
#define TIMESERVER_H
#include <QTcpServer>

class TimeServer : public QTcpServer
{
  Q_OBJECT
  public:
    TimeServer(QObject *parent = 0);

  protected slots:
    void serveConnection();
};
#endif // TIMESERVER_H
