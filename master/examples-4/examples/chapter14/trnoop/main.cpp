#include <QtCore>
#include <QDebug>

int main(int argc, char* argv[])
{
  static const char* cities[] = {
    QT_TR_NOOP("Cologne"),
    QT_TR_NOOP("Munich"),
    QT_TR_NOOP("Rome"),
    0
  };

  QCoreApplication app(argc, argv);

  QTranslator translator;
  QString filename = QString("trnoop_%1").arg(QLocale::system().name());
  filename = filename.toLower();
  translator.load(filename);
  app.installTranslator(&translator);


  int i = 0;
  while (cities[i])
    qDebug() << QObject::tr(cities[i++]);

  return 0;
}
