#include "datensatz.h"
#include <QHash>
#include <QMap>
#include <QSet>
#include <QDebug>

int main()
{
  Record d1("Molkentin", "Daniel");
  Record d2("Molkentin", "Moritz");
  Record d3("Molkentin", "Philipp");

  QMap<int, Record> map;
  map.insert(0, d1);
  map.insert(1, d2);
  map.insert(2, d3);

  QMapIterator<int, Record> mi(map);
  while ( mi.hasNext() ) {
    mi.next();
    qDebug() << mi.key() << ":" 
             << mi.value().surname() << mi.value().forename();
  }
  QHash<int, Record> hash;
  hash.insert(0, d1);
  hash.insert(1, d2);
  hash.insert(2, d3);

  QHashIterator<int, Record> hi(hash);
  while ( hi.hasNext() ) {
    hi.next();
    qDebug() << hi.key() << ":" 
             << hi.value().surname() << hi.value().forename();
    qDebug() << qHash(hi.value());
  }
  QSet<Record> set;
  set << d1 << d2 << d3;

  foreach(Record d, set)
    qDebug() << d.surname() << ":" << d.forename();

  return 0;
}
