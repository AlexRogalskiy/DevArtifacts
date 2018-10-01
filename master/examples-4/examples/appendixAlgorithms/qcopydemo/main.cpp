#include <QStringList>
#include <QVector>
#include <QDebug>

int main()
{
  QStringList list;
  list << "one" << "two" << "three";

  QVector<QString> vect(list.size());
  qCopy(list.begin(), list.end(), vect.begin());
  qDebug() << vect; // output: ( "one", "two", "three" )
  return 0;
}
