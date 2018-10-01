#include <QtGui>
#include "d2clabel.h"

D2cLabel::D2cLabel(QWidget *parent)
  : QLabel(parent)
{
  setWordWrap(true);
  setText(tr("<center>Drag from here to retrieve the text currently "
             "located in the clipboard or fill the clipboard by "
             "dragging text from abitrary places and dropping it here."
             "</center"));
  setAcceptDrops(true);
}
void D2cLabel::mousePressEvent(QMouseEvent *event)
{
  if (event->button() == Qt::LeftButton) {
    const QMimeData *mimeData = QApplication::clipboard()->mimeData();
    if (!mimeData) return;
    QDrag *drag = new QDrag(this);
    drag->setMimeData(cloneMimeData(
                                QApplication::clipboard()->mimeData()));
    drag->start();
  }
}
void D2cLabel::dragEnterEvent(QDragEnterEvent *event)
{
  event->acceptProposedAction();
}
void D2cLabel::dropEvent(QDropEvent *event)
{
  if(event && event->mimeData()) {
    QApplication::clipboard()->setMimeData(cloneMimeData
                                          (event->mimeData()));
  }
}

QMimeData* D2cLabel::cloneMimeData(const QMimeData *data)
{
  if (!data) 
    return 0;

  QMimeData *newData = new QMimeData;
  foreach(QString format, data->formats())
    newData->setData(format, data->data(format));

 return newData;
}
