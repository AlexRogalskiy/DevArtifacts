#include <QtGui>
#include "paintwidget.h"

PaintWidget::PaintWidget(QWidget *parent)
    : QWidget(parent)
{
}

void PaintWidget::paintEvent(QPaintEvent* /*ev*/)
{
  QPainter p(this);
  QPolygon poly;
  poly << rect().topLeft();
  poly << QPoint(rect().center().x(), rect().bottom());
  poly << rect().topRight();
  p.setClipRegion(poly);
  p.drawTiledPixmap(rect(), QPixmap("qt.png")); 
}
