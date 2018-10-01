#include <QtGui>

int main(int argc, char* argv[])
{
  QApplication app(argc, argv);
  QTableWidget tableWidget(3,3);
  for (int row=0;row<tableWidget.rowCount(); row++)
    for (int col=0;col<tableWidget.columnCount(); col++)
      tableWidget.setItem(row, col, 
	new QTableWidgetItem(QString::number(row*col)));
  tableWidget.show();
  return app.exec();
}
