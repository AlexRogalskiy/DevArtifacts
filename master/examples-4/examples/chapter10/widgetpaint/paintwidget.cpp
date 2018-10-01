#include <QtGui>
#include "paintwidget.h"

PaintWidget::PaintWidget(QWidget *parent)
    : QWidget(parent)
{
}

void PaintWidget::paintEvent(QPaintEvent* ev)
{
  QWidget::paintEvent(ev);
  QPainter p(this);
  p.setRenderHint(QPainter::Antialiasing, true);
  QPen pen(Qt::blue, 2);
  p.setPen(pen);
  QBrush brush(Qt::green);
  brush.setStyle(Qt::Dense4Pattern);
  p.setBrush(brush); 
  QRect ri = rect().adjusted(10,10,-10,-10);
  p.drawEllipse(ri);
}
