#include <QtCore>
#include <QDebug>

using namespace std;

int main() {
  QStringList list;
  list << "dog" << "cat" << "mouse";
  QStringList::iterator it;
  for (it = list.begin(); it != list.end(); ++it)
  {
    qDebug() << *it << endl;
  }
  return 0;
}
