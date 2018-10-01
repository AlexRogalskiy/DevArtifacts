#include <QList>
#include <QDebug>

int main()
{
  QList<int> values;
  values << 1 << 4 << 7 << 9;
  // content of values: 1, 4, 7, 9 
  qFill(values.begin(), values.end(), 0);
  qDebug() << values; // output: ( 0, 0, 0, 0 )
  return 0;
}
