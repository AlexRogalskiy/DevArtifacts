#include <QHash>
#include <QHashIterator>
#include <QDebug>

int main()
{
  QHash<QString, int> hash;

  hash["one"] = 1; // insert using [] operator
  hash["two"] = 2;
  hash.insert("seven", 7); // insert using insert()

  qDebug() << hash["seven"]; // value using [] operator
  qDebug() << hash.value("seven"); // value using value()

  QHashIterator<QString, int> i(hash);
  while (i.hasNext()) {
    i.next();
    qDebug() << i.key() << ":" << i.value();
  }
  return 0;
}
