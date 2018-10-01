#include <QtCore>
#include <iostream>
#include "record.h"

using namespace std;

void saveData(const QList<Record> &data, const QString &filename) {
   QFile file(filename);
   if (!file.open(QIODevice::WriteOnly)) return;
   QDataStream ds(&file);
   ds.setVersion(QDataStream::Qt_4_0);
   // Magic number
   ds << (quint32)0xDEADBEEF;
   // Version
   ds << (qint32)1;
   foreach(Record r, data)
     ds << r;
   file.close();
}
QList<Record> readData(const QString &filename) {
   QFile file(filename);
   file.open(QIODevice::ReadOnly);
   QDataStream ds(&file);
   ds.setVersion(QDataStream::Qt_4_0);
   // Magic number
   quint32 magic;
   ds >> magic;
   if (magic != 0xDEADBEEF) { 
     qWarning("Wrong magic!\n");
     return QList<Record>();
   }
   // Version
   qint32 version;
   ds >> version;
   if (version != 1) { 
     qWarning("Wrong version!\n");
     return QList<Record>();
   }
   QList<Record> recordList;
   Record record;
   while (!ds.atEnd()) {
     ds >> record;
     recordList.append(record);
   }
   file.close();
   return recordList;
}
int main()
{
   QList<Record> data;
   data.append(Record("Tilda", "Tilli", "Rosenweg", 4, 20095, 
     "Hamburg"));
   data.append(Record("Lara", "Lila", "Lilienweg", 14, 80799, 
     "Munich"));
   saveData(data, "file.db");
   data.clear();
   data = readData("file.db");
   foreach(Record record, data)
     cout << qPrintable(record.surname()) << endl;

   return 0;
}
