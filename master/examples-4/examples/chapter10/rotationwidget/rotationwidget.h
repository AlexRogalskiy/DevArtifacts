#ifndef ROTATIONWIDGET_H
#define ROTATIONWIDGET_H
#include <QWidget>
#include <QSize>

class RotationWidget : public QWidget {
  Q_OBJECT
  public:
    RotationWidget(QWidget *parent=0);

    QSize sizeHint() const {return QSize(200,200);}

  protected:
    void paintEvent(QPaintEvent *ev);
    void mousePressEvent(QMouseEvent *ev);
    void timerEvent(QTimerEvent *ev);
    void wheelEvent(QWheelEvent *ev);
 
    void rotate(int degree);
    
  private:
    int timerId;
    int degree;
};
#endif // ROTATIONWIDGET_H
