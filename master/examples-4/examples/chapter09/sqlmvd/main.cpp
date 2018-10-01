
#include <QtGui>
#include <QtSql>
#include <QDebug>

int main(int argc, char* argv[])
{
  QApplication app(argc, argv);

  QSqlDatabase db = QSqlDatabase::addDatabase("QMYSQL");
  db.setHostName("databaseserver.example.com");
  db.setDatabaseName("company");
  db.setUserName("user");
  db.setPassword("pass");
  db.setHostName("localhost");
  db.setDatabaseName("companydb");
  db.setUserName("root");
  db.setPassword("");

  if(!db.open())
    return 1;

  QTableView tableView;
  QSqlTableModel tableModel;
  tableModel.setTable("employees");
  tableModel.select();
  tableModel.removeColumn(0);
  tableView.setModel(&tableModel);
  tableView.setWindowTitle("'employees' table");
  tableView.show();
  QTableView tableRelationalView;
  QSqlRelationalTableModel tableRelationalModel;
  tableRelationalModel.setTable("employees");
  QSqlRelation rel("departments", "id", "name");
  tableRelationalModel.setRelation(3, rel);
  tableRelationalModel.select();
  tableRelationalView.setModel(&tableRelationalModel);
  tableRelationalView.setItemDelegate(
 		new QSqlRelationalDelegate(&tableRelationalView));
  tableRelationalView.setWindowTitle(
		"Tables with resolved relations");
  tableRelationalView.show();
  QTableView queryView;
  QSqlQueryModel queryModel;
  queryModel.setQuery("SELECT departments.name, "
	"COALESCE(COUNT(employees.lastname),0) "
	"FROM departments LEFT JOIN employees "
	"ON employees.department = departments.id "
	"GROUP BY employees.department");

  if (queryModel.lastError().isValid())
    qDebug() << queryModel.lastError();

  queryModel.setHeaderData(0, Qt::Horizontal, 
				QObject::tr("department"));
  queryModel.setHeaderData(1, Qt::Horizontal, 
				QObject::tr("employee count"));
  queryView.setModel(&queryModel);
  queryView.setWindowTitle("employee count per department");
  queryView.show();

  QWidget w;
  QPushButton *submitPb = new QPushButton(
		QObject::tr("Save Changes"));
  QPushButton *revertPb = new QPushButton(
		QObject::tr("Roll back changes"));
  QGridLayout *lay = new QGridLayout(&w);
  QTableView *manualTableView = new QTableView;
  lay->addWidget(manualTableView, 0, 0, 1, 2);
  lay->addWidget(submitPb, 1, 0);
  lay->addWidget(revertPb, 1, 1);
  QSqlTableModel manualTableModel;
  manualTableModel.setTable("employees");
  manualTableModel.select();
  manualTableModel.setEditStrategy(
		QSqlTableModel::OnManualSubmit);
  manualTableView->setModel(&manualTableModel);
  QObject::connect(submitPb, SIGNAL(clicked(bool)), 
		&manualTableModel, SLOT(submitAll()) );
  QObject::connect(revertPb, SIGNAL(clicked(bool)), 
		&manualTableModel, SLOT(revertAll()) );
  w.setWindowTitle("manually revertable table");
  w.show();

  return app.exec();
}

