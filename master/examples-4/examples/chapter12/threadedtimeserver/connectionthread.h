#ifndef CONNECTIONTHREAD_H
#define CONNECTIONTHREAD_H

#include <QThread>
#include <QTcpSocket>

class ConnectionThread : public QThread
{
  Q_OBJECT
  public:
    ConnectionThread(int socketDescriptor, QObject *parent = 0);
    void run();

  private:
    int socketDescriptor;
};
#endif // CONNECTIONTHREAD_H
