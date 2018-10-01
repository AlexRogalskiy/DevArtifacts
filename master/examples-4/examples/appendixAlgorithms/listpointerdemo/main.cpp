#include <QtGui>
#include <QDebug>

int main(int argc, char* argv[]) {
  QApplication app(argc, argv);
  QList<QWidget*> widgetList;
  for (int i = 1; i < 10; i++)
  {
     widgetList.append(new QWidget);
  }
  // the following is equivalent to qDeleteAll(widgetList);
  qDeleteAll(widgetList.begin(), widgetList.end()); 
  // delete all now invalid pointers
  widgetList.clear();
  // append new item, this is now the first list item
  widgetList.append(new QWidget);
  return 0;
}
