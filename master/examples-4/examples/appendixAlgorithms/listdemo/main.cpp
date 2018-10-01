#include <QList>
#include <QDebug>

int main()
{
  QList<int> values;
  values << 1 << 10 << 5 << 6 << 7 << 3;
  qSort(values);
  qDebug() << values; // output: ( 1, 3, 5, 6, 7, 10 )
  return 0;
}
