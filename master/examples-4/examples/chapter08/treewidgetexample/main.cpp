#include <QtGui>

int main(int argc, char* argv[])
{
  QApplication app(argc, argv);
  QTreeWidget treeWidget;
  treeWidget.setColumnCount(1);
  QStringList headerLabels;
  headerLabels << "Namen";
  treeWidget.setHeaderLabels(headerLabels);
  QTreeWidgetItem *parent = 
    new QTreeWidgetItem(&treeWidget, 
                        QStringList(QObject::tr("Otto+Margit")));
  parent->addChild(new QTreeWidgetItem
                        (QStringList(QObject::tr("Daniel"))));
  parent->addChild(new QTreeWidgetItem
                        (QStringList(QObject::tr("Moritz"))));
  parent->addChild(new QTreeWidgetItem
                        (QStringList(QObject::tr("Philipp"))));
  treeWidget.expandItem(parent);
  treeWidget.show();
  return app.exec();
}
