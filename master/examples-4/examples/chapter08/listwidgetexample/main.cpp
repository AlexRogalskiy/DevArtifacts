#include <QtGui>

int main(int argc, char* argv[])
{
  QApplication app(argc, argv);
  QListWidget listWidget;
  new QListWidgetItem(QObject::tr("Antje"), &listWidget);
  new QListWidgetItem(QObject::tr("Barbara"), &listWidget);
  new QListWidgetItem(QObject::tr("Daniel"), &listWidget);
  listWidget.show();
  return app.exec();
}
