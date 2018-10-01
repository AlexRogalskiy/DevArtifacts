#include <QtGui>

int main(int argc, char* argv[])
{
  QApplication app(argc, argv);

  QDirModel dirModel;
  QWidget w;
  w.setWindowTitle(QObject::tr("Four "
     "directory views using one model"));
  QGridLayout *lay = new QGridLayout(&w);

  QListView  *lv = new QListView;
  lay->addWidget(lv, 0, 0);
  lv->setModel(&dirModel);

  QListView  *lvi = new QListView;
  lay->addWidget(lvi, 0, 1);
  lvi->setViewMode(QListView::IconMode);
  lvi->setModel(&dirModel);

  QTreeView *trv = new QTreeView;
  lay->addWidget(trv, 1, 0);
  trv->setModel(&dirModel);

  QTableView *tav = new QTableView;
  tav->setModel(&dirModel);
  lay->addWidget(tav, 1, 1);

  QModelIndex cwdIndex = dirModel.index(QDir::currentPath());
  lv->setRootIndex(cwdIndex);
  lvi->setRootIndex(cwdIndex);
  trv->setRootIndex(cwdIndex);
  tav->setRootIndex(cwdIndex);

  w.show();

  return app.exec();
}

