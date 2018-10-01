#include <QStringList>
#include <QDebug>

int main()
{
  QStringList list;
  list << "apple" << "pear" << "banana";

  QStringList::iterator i1 = qFind(list.begin(), list.end(), "pear");
  // i1 == list.begin() + 1

  QStringList::iterator i2 = qFind(list.begin(), list.end(), "orange");
  // i2 == list.end()

  return 0;
}
