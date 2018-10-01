#ifndef D2CWIDGET_H
#define D2CWIDGET_H

#include <QLabel>
class QMimeData;

class D2cLabel : public QLabel
{
  Q_OBJECT
  public:
    D2cLabel(QWidget *parent = 0);

    void mousePressEvent(QMouseEvent *event);
    void dragEnterEvent(QDragEnterEvent *event);
    void dropEvent(QDropEvent *event);

  protected:
    QMimeData* cloneMimeData(const QMimeData *data);
};

#endif // D2CWIDGET_H

