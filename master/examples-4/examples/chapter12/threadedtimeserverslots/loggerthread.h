#ifndef LOGGERTHREAD_H
#define LOGGERTHREAD_H

#include <QThread>
#include <QFile>

class LoggerThread : public QThread
{
  Q_OBJECT
  public:
    LoggerThread(const QString& fileName, QObject *parent = 0);
    void run();

  public slots:
    void append(const QString& message);

  private:
    QFile file;
};
#endif // LOGGERTHREAD_H
