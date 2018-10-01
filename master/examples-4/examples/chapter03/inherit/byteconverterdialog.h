#ifndef BYTECONVERTERDIALOG_H
#define BYTECONVERTERDIALOG_H
#include <QDialog>
#include "ui_byteconverterdialog.h"

class QLineEdit;
class ByteConverterDialog : public QDialog, 
                            private Ui::ByteConverterDialog
{
    Q_OBJECT

public:
    ByteConverterDialog(QWidget *parent = 0);

private slots:
    void decChanged(const QString&);
    void hexChanged(const QString&);
    void binChanged(const QString&);
};

#endif
