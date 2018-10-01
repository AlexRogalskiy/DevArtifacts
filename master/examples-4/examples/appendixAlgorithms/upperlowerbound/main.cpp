#include <QDebug>
#include <QList>
#include <QVector>

int main()
{
  QList<int> list;
  list << 3 << 3 << 6 << 6 << 6 << 8;

  QList<int>::iterator it;
  it = qLowerBound(list.begin(), list.end(), 5);
  list.insert(it, 5);
  qDebug() << list; // output: ( 3, 3, 5, 6, 6, 6, 8 )

  it = qLowerBound(list.begin(), list.end(), 12);
  list.insert(it, 12);
  qDebug() << list; // output: ( 3, 3, 5, 6, 6, 6, 8, 12 )

  it = qLowerBound(list.begin(), list.end(), 12);
  list.insert(it, 12);
  qDebug() << list; // output: ( 3, 3, 5, 6, 6, 6, 8, 12, 12 )
  QVector<int> vect;
  vect << 3 << 3 << 6 << 6 << 6 << 8;
  QVector<int>::iterator begin6 =
        qLowerBound(vect.begin(), vect.end(), 6);
  QVector<int>::iterator end6 =
        qUpperBound(vect.begin(), vect.end(), 6);
  QVector<int> vect2(end6-begin6);
  qCopy(begin6, end6, vect2.begin());
  qDebug() << vect2; // output: ( 6, 6, 6 )
  int count6 = 0;
  qCount(vect.begin(), vect.end(), 6, count6);
  qDebug() << count6; // output: 3
  return 0;
}
