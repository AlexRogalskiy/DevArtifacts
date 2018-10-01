#include <QtGui>
#include <QtSql>
#include <QDebug>

int main(int argc, char* argv[])
{
  QApplication app(argc, argv);

  QSqlDatabase db = QSqlDatabase::addDatabase("QMYSQL");
  db.setHostName("datenbankserver.example.com");
  db.setDatabaseName("firma");
  db.setUserName("user");
  db.setPassword("pass");

  if (!db.open()) {
     qDebug() << db.lastError();
     return 1;
  }

  QSqlQuery query("SELECT firstname, lastname FROM employees");
  QSqlRecord record = query.record();
  while (query.next()) {
    QString  firstname = 
       query.value(record.indexOf("firstname")).toString();
    QString  lastname = 
       query.value(record.indexOf("lastname")).toString();
    qDebug() << query.at() << ":" << lastname << "," << firstname;
  }
  query.exec("DELETE FROM employees WHERE lastname = 'Hasse'");
  qDebug() << query.numRowsAffected(); // "1"
  query.prepare("INSERT INTO employees (lastname, firstname, department)"
                "VALUES(:lastname, :firstname, :department)");
  query.bindValue(":lastname", "Hasse");
  query.bindValue(":firstname", "Peter");
  query.bindValue(":department", 3);
  query.exec();
  query.prepare("INSERT INTO employees (lastname, firstname, department)"
                "VALUES(?, ?, ?)");
  query.addBindValue("Schwan");
  query.addBindValue("Waldemar");
  query.addBindValue(3);
  query.exec();
  query.prepare("CALL countEmployees(?)");
  query.bindValue(0, 0, QSql::Out);
  query.exec();
  qDebug() << query.boundValue(0).toInt();
  query.exec("CALL countEmployees(@outwert)");
  query.exec("SELECT @outwert");
  query.next();
  qDebug() << query.value(0);
  return 0;
}
