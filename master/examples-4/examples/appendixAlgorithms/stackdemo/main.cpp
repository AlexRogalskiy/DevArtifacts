#include <QStack>
#include <QDebug>

int main()
{
  QStack<int> stack;
  stack.push(1);
  stack.push(2);
  stack.push(3);
  while (!stack.isEmpty())
    qDebug() << stack.pop(); // output: 3, 2, 1
  return 0;
}
