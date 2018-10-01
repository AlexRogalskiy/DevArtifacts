#include <QtCore>
#include <QtNetwork>
#include <QDebug>
#include "loggerthread.h"

LoggerThread::LoggerThread(const QString& fileName, QObject* parent)
  : QThread(parent)
{
  file.setFileName(fileName);
}

void LoggerThread::run()
{
  exec();
}

void LoggerThread::append(const QString& message)
{
  file.open(QIODevice::WriteOnly|QIODevice::Append);
  file.write(message.toUtf8()+'\n');
  file.close();
}
