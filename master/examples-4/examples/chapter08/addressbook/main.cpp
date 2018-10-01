#include <QtGui>
#include "addressbookmodel.h"

int main( int argc, char* argv[] )
{
  QApplication app( argc, argv );

  // Open the addressbook file in the working directory 
  QFile file("addressbook.csv");
  if ( !file.open(QIODevice::ReadOnly|QIODevice::Text) )
	  return 1;

  // Read its content into a string
  QString addresses = QString::fromUtf8(file.readAll());
  AddressbookModel model(addresses);

  QListView listView;
  listView.setModel(&model);
  listView.setModelColumn(0);
  listView.show();

  QTreeView treeView;
  treeView.setModel(&model);
  treeView.show();

  QTableView tableView;
  tableView.setModel(&model);
  tableView.show();

  return app.exec();
}
