#include <QStringList>
#include <QDebug>

int main()
{
  QStringList names;
  names << "Patricia" << "Markus" << "Uli";
  foreach(QString name, names)
    qDebug() << name;
  return 0;
}
