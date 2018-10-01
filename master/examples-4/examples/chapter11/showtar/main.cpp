#include <QtGui>

int main(int argc, char* argv[])
{
  if (argc < 2) 
    return 1;

  QApplication app(argc, argv);

  QProcess tar;
  QStringList env = QProcess::systemEnvironment();
  env.replaceInStrings(QRegExp("^LANG=(.*)"),"LANG=C");
  tar.setEnvironment(env);
  QStringList args;
  args << "tf" << argv[1];
  tar.start("tar", args);
  QByteArray output;
  while ( tar.waitForReadyRead() )
    output += tar.readAll();
  QStringList entries = QString::fromLocal8Bit(output).split('\n');
  entries.removeLast();

  QListWidget w;

  QIcon fileIcon = app.style()->standardIcon(QStyle::SP_FileIcon); 
  QIcon dirIcon = app.style()->standardIcon(QStyle::SP_DirClosedIcon);

  foreach(QString entry, entries) {
    if (entry.endsWith('/'))
      new QListWidgetItem(dirIcon, entry, &w);
    else
      new QListWidgetItem(fileIcon, entry, &w);
  }

  w.show();
  return app.exec();
}
