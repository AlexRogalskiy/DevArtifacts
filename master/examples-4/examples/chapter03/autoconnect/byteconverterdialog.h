#ifndef BYTECONVERTERDIALOG_H
#define BYTECONVERTERDIALOG_H
#include <QDialog>
#include "ui_byteconverterdialog.h"

class QLineEdit;

class ByteConverterDialog : public QDialog, private Ui::ByteConverterDialog
{
    Q_OBJECT

public:
    ByteConverterDialog(QWidget *parent = 0);

private slots:
    void on_decEdit_textChanged(const QString&);
    void on_hexEdit_textChanged(const QString&);
    void on_binEdit_textChanged(const QString&);
};

#endif
