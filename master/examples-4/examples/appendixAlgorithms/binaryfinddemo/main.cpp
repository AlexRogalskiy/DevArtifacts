#include <QList>
#include <QDebug>

int main() {
  QList<int> numbers;
  numbers << 1 << 5 << 6 << 7 << 9 << 11;
  QList<int>::iterator it;
  it = qBinaryFind(numbers.begin(), numbers.end(), 6);
  // it == numbers.begin() + 2
  qDebug() << *it; // 6
  numbers.clear();
  numbers << 1 << 6 << 6 << 6 << 9 << 11;
  it = qBinaryFind(numbers.begin(), numbers.end(), 6);
  // it == numbers.begin() + 1 or
  // it == numbers.begin() + 2 or
  // it == numbers.begin() + 3
  qDebug() << *it;

  return 0;
}
