#include <QStringList>
#include <QDebug>

bool caseInsensitiveLessThan(const QString &s1, const QString &s2)
{
  return s1.toLower() < s2.toLower();
}

int main()
{
  QStringList list;
  list << "AlPha" << "beTA" << "gamma" << "DELTA";
  qSort(list.begin(), list.end(), caseInsensitiveLessThan);
  qDebug() << list; // ( "AlPha", "beTA", "DELTA", "gamma" )
  return 0;
}
