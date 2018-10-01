#include <QtCore>
#include <QDebug>

int main() {
  QList<int> intlist;
  intlist << 2 << 5 << 2 << 4 << 2;

  int findings = 0;
  QListIterator<int> it(intlist);

  while (it.findNext(2))
    findings++;
  qDebug() << findings; // output: 3
  // Iterator is positioned after the last '2' element
  while (it.findPrevious(2))
    findings--;
  qDebug() << findings; // : 0
  // Iterator is positioned before the first '2' element
  return 0;
}
