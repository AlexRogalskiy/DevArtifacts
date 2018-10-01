#ifndef DROPLABEL_H
#define DROPLABEL_H
#include <QLabel>

class DropLabel: public QLabel
{
    Q_OBJECT
    public:
        DropLabel(QWidget *parent = 0);
        void dragEnterEvent(QDragEnterEvent *event);
        void dropEvent(QDropEvent *event);
};
#endif // DROPLABEL_H
