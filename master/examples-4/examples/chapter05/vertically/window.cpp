#include <QtGui>
#include "window.h"

Window::Window(QWidget *parent) : QWidget(parent)
{
    resize(640, 480);

    QVBoxLayout *lay = new QVBoxLayout(this);

    QTextEdit *txt = new QTextEdit(this);
    lay->addWidget(txt);

    QPushButton *btn = new QPushButton(tr("&Close"), this);
    lay->addWidget(btn);
}

