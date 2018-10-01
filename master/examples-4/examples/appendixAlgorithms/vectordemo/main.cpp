#include <QVector>
#include <QDebug>

int main() 
{
  const int n = 10;
  QVector<int> vector(n);
  int *data = vector.data();
  // fill vector
  for (int i = 0; i < n; ++i)
    data[i] = i;
  for (int i = 0; i < n; ++i) {
    data[i] *= 2;
    qDebug() << vector.at(i);
  }
  QVector<QString> strvector;
  strvector.append("short string");
  if (strvector[0] == "short string")
    strvector[0] = "extra loooong and verbose string";
  qDebug() << strvector;
  return 0;
}
