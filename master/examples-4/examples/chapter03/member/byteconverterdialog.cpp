#include <QtGui>

#include "byteconverterdialog.h"

ByteConverterDialog::ByteConverterDialog(QWidget *parent)
 : QDialog(parent)
{
  ui.setupUi(this);

  connect(ui.decEdit, SIGNAL(textChanged(const QString&)),
          this, SLOT(decChanged(const QString&)));
  connect(ui.hexEdit, SIGNAL(textChanged(const QString&)),
          this, SLOT(hexChanged(const QString&)));
  connect(ui.binEdit, SIGNAL(textChanged(const QString&)),
          this, SLOT(binChanged(const QString&)));

}

void ByteConverterDialog::decChanged(const QString& newValue)
{
    bool ok;
    int num = newValue.toInt(&ok);
    if (ok) {
        ui.hexEdit->setText(QString::number(num, 16));
        ui.binEdit->setText(QString::number(num, 2));
    } else {
        ui.hexEdit->setText("");
        ui.binEdit->setText("");
    }
}
void ByteConverterDialog::hexChanged(const QString& newValue)
{
    bool ok;
    int num = newValue.toInt(&ok, 16);
    if (ok) {
        ui.decEdit->setText(QString::number(num));
        ui.binEdit->setText(QString::number(num, 2));
    } else {
        ui.decEdit->setText("");
        ui.binEdit->setText("");
    }
}

void ByteConverterDialog::binChanged(const QString& newValue)
{
    bool ok;
    int num = newValue.toInt(&ok, 2);
    if (ok) {
        ui.decEdit->setText(QString::number(num));
        ui.hexEdit->setText(QString::number(num, 16));
    } else {
    }
}
