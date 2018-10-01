#include <QMap>
#include <QDebug>

int main()
{
  QMultiMap<QString, int> trunks;
  trunks.insert("Beech", 100);
  trunks.insert("Umbrella pine", 50);
  trunks.insert("Maple", 50);
  trunks.insert("Beech", 20);
  trunks.insert("Fir", 70);
  trunks.insert("Beech", 40);

  QList<int> beeches = trunks.values("Beech");
  qDebug() << beeches; // output: 40, 20, 100
  return 0;
}
