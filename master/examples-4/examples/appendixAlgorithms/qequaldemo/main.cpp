#include <QStringList>
#include <QVector>
#include <QDebug>

int main()
{
  QStringList list;
  list << "one" << "two" << "three";

  QVector<QString> vect(3);
  vect[0] = "one";
  vect[1] = "two";
  vect[2] = "three";

  bool ret = qEqual(list.begin(), list.end(), vect.begin());
  qDebug() << ret; // output: true

  return 0;
}
