#include <QtGui>
#include <QDebug>

int main(int argc, char* argv[])
{
QApplication app(argc, argv);
QString text = QObject::tr("<qt>This is a <b>very</b> complicated way"
  "of showing message boxes. <i>Only use this in exceptional cases</i>! "
  "Do you want to continue?</qt>");
QMessageBox msg(QObject::tr("Academic Example Warning"), text, 
  QMessageBox::Warning, QMessageBox::Yes|QMessageBox::Default,
  QMessageBox::No|QMessageBox::Escape, QMessageBox::NoButton);

if (msg.exec() == QMessageBox::Yes)
{
  qDebug() << "Keep on going!";
}
return 0;
}
