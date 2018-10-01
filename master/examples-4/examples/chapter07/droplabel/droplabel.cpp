#include <QtGui>
#include "droplabel.h"

DropLabel::DropLabel(QWidget *parent)
  : QLabel(parent)
{
  setAcceptDrops(true);
}

void DropLabel::dragEnterEvent(QDragEnterEvent *event)
{
  if (event && event->mimeData()) {
    const QMimeData* md = event->mimeData();
    if (md->hasImage() || md->hasUrls() || md->hasText())
        event->acceptProposedAction();
  }
}
void DropLabel::dropEvent(QDropEvent *event)
{
  QPixmap pix;
  if(event && event->mimeData()) {
    const QMimeData *data = event->mimeData();
    if (data->hasImage())
      pix = data->imageData().value<QPixmap>();
    else if(data->hasUrls())
      foreach(QUrl url, data->urls()) {
        QFileInfo info(url.toLocalFile());
        if(info.exists() && info.isFile())
          pix = QPixmap(url.toLocalFile());
        if (pixmap() && !pixmap()->isNull())
          break;
      }
      else if(data->hasText()) {
        QUrl url(data->text());
        QFileInfo info(url.toLocalFile());
        if(info.exists() && info.isFile())
          pix = QPixmap(url.toLocalFile());
    }
  }
  if (!pix.isNull()) {
    setPixmap(pix);
    resize(pix.size());
  }
}
