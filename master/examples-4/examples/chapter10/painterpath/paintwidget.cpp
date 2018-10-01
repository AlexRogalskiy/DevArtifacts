#include <QtGui>
#include "paintwidget.h"

PaintWidget::PaintWidget(QWidget *parent)
    : QWidget(parent)
{
}

void PaintWidget::paintEvent(QPaintEvent* /*ev*/)
{
  QLinearGradient gradient(rect().topLeft(), rect().bottomRight());
  gradient.setColorAt(0, Qt::yellow);
  gradient.setColorAt(1, Qt::white);

  QPainterPath path;
  path.cubicTo(rect().topLeft(), rect().bottomLeft(), 
    rect().bottomRight());
  path.cubicTo(rect().topRight(), rect().bottomRight(), 
    rect().bottomLeft());

  QPainter p(this);
  p.setRenderHint(QPainter::Antialiasing, true);
  p.drawTiledPixmap(rect(), QPixmap("qt.png"));
  p.setBrush(gradient);
  p.drawPath(path);
}
