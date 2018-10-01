#include <QtGui>
#include "filedialog.h"

int main(int argc, char* argv[])
{
  QApplication app(argc, argv);

  FileDialog dialog;

  if ( dialog.exec() == QDialog::Accepted )
    qDebug() << dialog.selectedFiles();

  return 0;
}

