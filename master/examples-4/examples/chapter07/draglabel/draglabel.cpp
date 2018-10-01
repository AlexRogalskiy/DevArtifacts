#include <QtGui>

QMimeData* prepareImageDrag( const QString& path ) 
{
  QImage pic( path );
  QMimeData *mimeData = new QMimeData;
  mimeData->setImageData( pic );
  QList<QUrl> urls;
  QUrl imageUrl( path );
  urls.append( imageUrl ); 
  mimeData->setUrls( urls );
  mimeData->setText( imageUrl.path() );
  return mimeData;
}
#include "draglabel.h"

DragLabel::DragLabel(const QString& path, QWidget *parent)
  : QLabel(parent), picPath(path)
{
  setPixmap(QPixmap(path));
}
void DragLabel::mousePressEvent(QMouseEvent *event)
{
  if (event->button() == Qt::LeftButton) {
    QMimeData* data = prepareImageDrag(picPath);
    QDrag *drag = new QDrag(this);
    drag->setMimeData(data);
    if (pixmap())
      drag->setPixmap(pixmap()->
        scaled(100,100, Qt::KeepAspectRatio));
    drag->start();
  }
}
