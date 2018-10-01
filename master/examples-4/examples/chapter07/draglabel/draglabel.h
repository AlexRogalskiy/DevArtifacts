#ifndef DRAGLABEL_H
#define DRAGLABEL_H

#include <QLabel>
class QMimeData;

class DragLabel : public QLabel
{
  Q_OBJECT
  public:
    DragLabel(const QString& path, QWidget *parent = 0);

    void mousePressEvent(QMouseEvent *event);

  private:
    QString picPath;
};

#endif // DRAGLABEL_H
