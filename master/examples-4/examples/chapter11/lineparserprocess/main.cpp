#include <QtGui>
#include "lineparserprocess.h"

int main(int argc, char* argv[])
{
  if (argc < 2) return 1;
  QApplication app(argc, argv);
  QListWidget w;
  LineParserProcess process(&w);
  process.setWorkingDirectory(QString::fromLocal8Bit(argv[1]));
  process.start("ls", QStringList() << "-Rl" );
  w.show();
  return app.exec();
}
