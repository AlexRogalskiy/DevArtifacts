#include <QtCore>
#include <QDebug>

int main() {
  QList<int> intlist;
  intlist << 2 << 5 << 2 << 4 << 2;

  QMutableListIterator<int> mit(intlist);

  while (mit.findNext(2))
    mit.remove();
  qDebug() << intlist; // output: (5, 4)
  return 0;
}
