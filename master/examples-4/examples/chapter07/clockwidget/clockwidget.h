#ifndef CLOCKWIDGET_H
#define CLOCKWIDGET_H

#include <QLCDNumber>

class QTimerEvent;

class ClockWidget : public QLCDNumber
{
  Q_OBJECT
  public:
    ClockWidget(QWidget *parent = 0);

  protected: 
    void timerEvent(QTimerEvent *e); 

  private:
    int updateTimer, switchTimer;
    bool showClock;
};

#endif // CLOCKWIDGET_H
