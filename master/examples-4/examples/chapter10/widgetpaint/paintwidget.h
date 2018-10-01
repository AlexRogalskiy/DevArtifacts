#include <QWidget>

class PaintWidget : public QWidget
{
    Q_OBJECT
    public:
    PaintWidget(QWidget* parent = 0);
    ~PaintWidget() {};
  
    virtual void paintEvent(QPaintEvent*);
    virtual QSize sizeHint() const {return QSize(200,200);}
};
