#include <QtGui>
#include "rotationwidget.h"

RotationWidget::RotationWidget(QWidget *parent)
  : QWidget(parent)
{
  degree = 0;
  timerId = 0;
}
void RotationWidget::paintEvent(QPaintEvent* /*ev*/)
{
  QRect paintRect = rect();
  paintRect.setWidth(paintRect.height());
  paintRect.adjust(2,2,-2,-2);
  QPainter p(this);
  p.setRenderHint(QPainter::Antialiasing, true);

  QPoint center = paintRect.center();
  QMatrix m;
  m.translate(center.x(), center.y());
  m.rotate(degree);
  m.translate(-center.x(), -center.y());
  p.setMatrix(m);

  p.setBrush(QPixmap("qt.png"));
  p.setPen(QPen(Qt::black, 2, Qt::DashLine));
  p.drawEllipse(paintRect);
}
void RotationWidget::mousePressEvent(QMouseEvent* ev)
{
  if (ev->button() != Qt::LeftButton) 
    return;
  if ( timerId == 0 )
    timerId = startTimer(20);
  else {
    killTimer(timerId);
    timerId = 0;
 }
}

void RotationWidget::timerEvent(QTimerEvent *ev)
{
  if (ev->timerId() == timerId)
    rotate(1);

}
void RotationWidget::wheelEvent(QWheelEvent *ev)
{
  rotate(ev->delta()/8);
}

void RotationWidget::rotate(int deg)
{
  degree = degree + deg % 360;
  update();
}
