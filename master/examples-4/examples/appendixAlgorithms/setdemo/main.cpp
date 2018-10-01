#include <QSet>
#include <QDebug>

int main()
{
  QSet<int> set1;
  set1 << 1 << 2 << 3 << 4 << 5 << 6;
  QSet<int> set2;
  set2 << 4 << 5 << 6 << 7 << 8 << 9;
  set1.subtract(set2);
  // output: 1, 2, 3
  qDebug() << "set1 remainders:" << set1; 

  return 0;
}
