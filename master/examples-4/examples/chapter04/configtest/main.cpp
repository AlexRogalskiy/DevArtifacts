#include <QtCore>
#include <QtDebug>

int main(int argc, char *argv[]) 
{
QCoreApplication app(argc, argv);
// manufacturer, product
QSettings settings("OpenSourcePress", "ConfigTest");
QString hello = "Hello, world!";
// store a value
settings.setValue("Greeting", hello);
// reset variable
hello = "";
// read value and assign to variable
hello = settings.value("Greeting").toString();
qDebug() << hello; // prints "Hello, world!"
return 0;
}
