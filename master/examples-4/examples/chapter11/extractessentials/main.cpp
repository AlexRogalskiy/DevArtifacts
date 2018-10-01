#include <QtCore>
#include <iostream>
#include <stdio.h>
using namespace std;

int main(int argc, char* argv[])
{
  if (argc < 2) {
    cout << "Usage: " << argv[0] << " infile [outfile]" << endl;
    return 1;
  }

  QFile in(argv[1]);
  if(!in.open(QIODevice::ReadOnly|QIODevice::Text)) {
    cerr << "File " << argv[1] << " does not exist" << endl;
  }

  QFile out;
  if (argc >= 3) {
    out.setFileName(argv[2]);
    if (out.exists()) {
      cerr << "File" << argv[2] << " already exists" << endl;
      return 1;
    }
    if(!out.open(QIODevice::WriteOnly|QIODevice::Text)) {
      cerr << "Failed to open file " << argv[2] << 
        " for writing" << endl;
      return 1;
    }
  }
  else
    if(!out.open(stdout, QIODevice::WriteOnly|QIODevice::Text)) {
      cerr << "Failed to open standard output for writing" << endl;
      return 1;
    }

  while (!in.atEnd()) {
   QByteArray line = in.readLine();
   if (!line.trimmed().isEmpty() && 
       !line.trimmed().startsWith('#'))
     out.write(line);
  }

  in.close();
  out.close();

  return 0;
}
