#include <QtGui>
#include <QDebug>
#include "lineparserprocess.h"

LineParserProcess::LineParserProcess(QListWidget *w, QObject *parent)
  : QProcess(parent), listWidget(w)
{
  connect(this, SIGNAL(readyRead()), SLOT(readData()));
  QStringList env = systemEnvironment();
  env.replaceInStrings(QRegExp("^LANG=(.*)"),"LANG=C");
  setEnvironment(env);
}

void LineParserProcess::readData()
{
  QByteArray line;
  while (!(line = readLine()).isEmpty())
     new QListWidgetItem(QString::fromLocal8Bit(line), listWidget);
}
