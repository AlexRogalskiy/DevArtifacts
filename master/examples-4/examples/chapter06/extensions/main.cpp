#include <QtGui>

int main(int argc, char* argv[])
{
  QApplication app(argc, argv);
  QDialog dlg;
  QPushButton *btn = new QPushButton(QObject::tr("Expand/Collapse"), 
                                    &dlg);
  btn->setCheckable(true);
  QVBoxLayout *lay = new QVBoxLayout(&dlg);
  lay->addWidget(btn);
  QLabel *ext = new QLabel(QObject::tr("Extension"));
  dlg.setExtension(ext);
  QObject::connect(btn, SIGNAL(toggled(bool)), 
                  &dlg, SLOT(showExtension(bool)));

  dlg.exec();
  return app.exec();
}
