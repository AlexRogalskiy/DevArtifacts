#include <QtGui>

int main(int argc, char* argv[])
{
  QApplication app(argc, argv);
  QListWidget listWidget;

  // Setup a prototype
  QListWidgetItem *proto = new QListWidgetItem;
  proto->setFont(QFont("Times"));
  proto->setTextColor(Qt::blue);
  proto->setBackgroundColor(Qt::yellow);


  // Clone and modify object, insert it 
  // before everything else
  QListWidgetItem *name = proto->clone();
  name->setText("Antje");
  listWidget.insertItem(0, name);

  // Same procedure...
  name = proto->clone();
  name->setText("Daniel");
  listWidget.insertItem(0, name);

  // Use proto itself
  name = proto;
  name->setText("Barbara");
  listWidget.insertItem(0, name);

  // Sort the list
  listWidget.sortItems();

  listWidget.show();
  return app.exec();
}
