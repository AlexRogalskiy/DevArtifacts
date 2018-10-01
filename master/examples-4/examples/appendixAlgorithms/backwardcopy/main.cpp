#include <QStringList>
#include <QVector>
#include <QDebug>

int main()
{
  QStringList list;
  list << "one" << "two" << "three";

  QVector<QString> vect(5);
  qCopyBackward(list.begin(), list.end(), vect.end());
  qDebug() << vect; // output: ( "", "", "one", "two", "three" )
  return 0;
}
