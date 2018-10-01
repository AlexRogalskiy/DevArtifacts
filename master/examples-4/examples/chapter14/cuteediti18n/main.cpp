
#include <QApplication>
#include <QTranslator>
#include <QLocale>
#include "mainwindow.h"

int main(int argc, char *argv[])
{
  QApplication app(argc, argv);

  QTranslator cuteeditTranslator;
  QString filename = QString("cuteedit_%1").arg(QLocale::system().name());
  filename = filename.toLower();
  cuteeditTranslator.load(filename);
  app.installTranslator(&cuteeditTranslator);
  QTranslator qtTranslator;
  filename = QString("qt_%1").arg(QLocale::system().name());
  filename = filename.toLower();
  qtTranslator.load("qt_" + QLocale::system().name());
  app.installTranslator(&qtTranslator);

  QCoreApplication::setOrganizationName("OpenSourcePress");
  QCoreApplication::setOrganizationDomain("OpenSourcePress.de");
  QCoreApplication::setApplicationName("CuteEdit");

  MainWindow mainWindow;
  mainWindow.show();

  return app.exec();
}
