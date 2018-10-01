#include <QList>
#include <QDebug>

int main()
{
  // compare instances of a POD and look for minimum
  int max = qMax(100, 200); // max == 200

  // compare instances of a class (QString): looks for
  // the lexicographic minimum 
  QString s1 = "Daniel";
  QString s2 = "Patricia";
  QString min = qMin(s1, s2); 
  qDebug() << min; // output: "Daniel"
}
