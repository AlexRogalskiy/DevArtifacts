#include <QtGui>
#include "paintwidget.h"

PaintWidget::PaintWidget(QWidget *parent)
    : QWidget(parent)
{
}

void PaintWidget::paintEvent(QPaintEvent* /*ev*/)
{
  QPainterPath path;
  path.cubicTo(rect().topLeft(), rect().bottomLeft(), 
    rect().bottomRight());
  path.cubicTo(rect().topRight(), rect().bottomRight(), 
    rect().bottomLeft());

  QPainter p(this);
  p.setRenderHint(QPainter::Antialiasing, true);
  p.drawTiledPixmap(rect(), QPixmap("qt.png"));
  p.setBrush(QColor::fromRgba(qRgba(0,0,0,128)));
  p.setCompositionMode(QPainter::CompositionMode_DestinationOut);
  p.drawPath(path);
}
