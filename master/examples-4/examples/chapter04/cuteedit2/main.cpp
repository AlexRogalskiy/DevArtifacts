#include <QApplication>
#include "mainwindow.h"

int main(int argc, char *argv[])
{
    QApplication a(argc, argv);

    QCoreApplication::setOrganizationName("OpenSourcePress");
    QCoreApplication::setOrganizationDomain("OpenSourcePress.de");
    QCoreApplication::setApplicationName("CuteEdit");
    MainWindow mainWindow;
    mainWindow.show();

    return a.exec();
}
