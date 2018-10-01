#ifndef LINEPARSERPROCESS_H
#define LINEPARSERPROCESS_H

#include <QProcess>

class QListWidget;

class LineParserProcess : public QProcess
{
  Q_OBJECT
  public:
    LineParserProcess(QListWidget*w, QObject *parent=0);

  protected slots:
    void readData();
  
  protected:
    QListWidget *listWidget;
};
#endif // LINEPARSERPROCESS_H
