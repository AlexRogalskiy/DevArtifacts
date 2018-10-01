#include <QtGui>
#include "clockwidget.h"

ClockWidget::ClockWidget(QWidget *parent)
  : QLCDNumber(parent), showClock(true)
{
  setFrameShape(QFrame::NoFrame);
  setSegmentStyle(QLCDNumber::Flat);	

  updateTimer = startTimer(1000);
  switchTimer = startTimer(10000);

  QTimerEvent *e = new QTimerEvent(updateTimer);
  QCoreApplication::postEvent(this, e);
}
void ClockWidget::timerEvent(QTimerEvent *e)
{
  if (!e) return;

  if (e->timerId() == switchTimer)
    showClock = !showClock;

  if (e->timerId() == updateTimer) {
    if (showClock) {
      QTime time = QTime::currentTime();
      QString str = time.toString(Qt::LocalDate);
      setNumDigits(str.length());
      display(str);
    } else {
      QDate date = QDate::currentDate();
      QString str = date.toString(Qt::LocalDate);
      setNumDigits(str.length());
      display(str);
    }
  }
}
