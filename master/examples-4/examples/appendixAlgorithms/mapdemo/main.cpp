#include <QMap>
#include <QMapIterator>
#include <QDebug>

int main()
{
  QMap<QString, int> map;

  map["one"] = 1; // insert using the [] operator
  map["two"] = 2;
  map.insert("seven", 7); // insert using insert()

  qDebug() << map["seven"]; // read using the [] operator
  qDebug() << map.value("seven"); // read using value()

  QMapIterator<QString, int> i(map);
  while (i.hasNext()) {
    i.next();
    qDebug() << i.key() << ":" << i.value();
  }
  return 0;
}
