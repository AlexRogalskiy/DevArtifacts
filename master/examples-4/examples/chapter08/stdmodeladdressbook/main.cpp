#include <QtGui>

QStringList splitCSVLine(const QString& line)
{
  bool inItem = false;
  QStringList items;
  QString item;

  for (int pos = 0; pos < line.length(); pos++)
  {
    QChar c = line.at(pos);
    if ( c == '\'') {
      if (inItem) {
        items.append(item);
        item = "";
      }
      inItem = !inItem;
    }
    else 
      if (inItem)
         item += c;
  }
  return items;
}
int main(int argc, char* argv[])
{
  QApplication app(argc, argv);

  // Open file 
  QFile file("addressbook.csv");
  if ( !file.open(QIODevice::ReadOnly|QIODevice::Text) )
	  return 1;
  // Read addresses line for line into a stringlist 
  QString addresses = QString::fromUtf8(file.readAll());
  QStringList records = addresses.split('\n');

  // Take the first row with the headers and split them
  QString header = records.takeAt(0);
  QStringList headers = splitCSVLine(header);

  // Create a model using the number of rows and columns as arguments
  QStandardItemModel model(records.count(), headers.count());
  
  // Add headers
  for (int col=0;col<headers.count(); col++) {
     model.setHeaderData(col, Qt::Horizontal, headers.at(col));
  }

  // Add contents
  for (int recNo=0;recNo<records.count(); recNo++) {
     QStringList cells = splitCSVLine(records.at(recNo));
     for (int col=0;col<cells.count(); col++) {
        QModelIndex index = model.index(recNo, col, QModelIndex());
        model.setData(index, cells.at(col));
     }
  }

  // Create, set and show model
  QTreeView treeView;
  treeView.setWindowTitle(QObject::tr("Addressbook via QStandardItemModel"));
  treeView.setModel(&model);
  treeView.show();

  return app.exec();
}
