#include <QtCore>
#include <QDebug>

int main() {
  QList<int> intlist;
  intlist << 2 << 5 << 2 << 4 << 2;

  QMutableListIterator<int> mit(intlist);
  mit.toBack();
  mit.insert(2);
  qDebug() << intlist; // output: (2, 5, 2, 4, 2, 2)

  int findings = 0;
  while (mit.findPrevious(2))
    findings++;
  qDebug() << findings; // output: 4
  return 0;
}
