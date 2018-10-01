#include <QtGui>
#include "filedialog.h"

FileDialog::FileDialog(QWidget *parent)
  : QDialog(parent)
{
  setupUi(this);

  dirModel = new QDirModel;
  selModel = new QItemSelectionModel(dirModel);
  
  listView->setModel(dirModel);
  treeView->setModel(dirModel);
  iconView->setModel(dirModel);

  listView->setSelectionModel(selModel);
  treeView->setSelectionModel(selModel);
  iconView->setSelectionModel(selModel);

  QModelIndex cwdIndex = 
      dirModel->index(QDir::rootPath());

  listView->setRootIndex(cwdIndex);
  treeView->setRootIndex(cwdIndex);
  iconView->setRootIndex(cwdIndex);
  for (int r = 0; r < dirModel->rowCount(QModelIndex()); ++r) {
    QModelIndex index = dirModel->index(r, 0, QModelIndex());
    if (index.isValid())
      comboBox->addItem(dirModel->fileIcon(index), 
       dirModel->filePath(index));
  }
  connect(listView, SIGNAL(activated(const QModelIndex&)), 
               SLOT(switchToDir(const QModelIndex&)));
  connect(treeView, SIGNAL(activated(const QModelIndex&)), 
               SLOT(switchToDir(const QModelIndex&)));
  connect(iconView, SIGNAL(activated(const QModelIndex&)), 
               SLOT(switchToDir(const QModelIndex&)));

  connect(listView, SIGNAL(clicked(const QModelIndex&)), 
               SLOT(syncActive(const QModelIndex&)));
  connect(treeView, SIGNAL(clicked(const QModelIndex&)), 
               SLOT(syncActive(const QModelIndex&)));
  connect(iconView, SIGNAL(clicked(const QModelIndex&)), 
               SLOT(syncActive(const QModelIndex&)));

  connect(switchButton, SIGNAL(clicked()), SLOT(switchView()));
}
QStringList FileDialog::selectedFiles()
{
  QStringList fileNames;
  QModelIndexList indexes = selModel->selectedIndexes();
  foreach( QModelIndex index, indexes )
    fileNames.append( dirModel->filePath(index) );
  return fileNames;
}
void FileDialog::switchToDir(const QModelIndex& index)
{
  if (dirModel->isDir(index)) {
    listView->setRootIndex(index);
    iconView->setRootIndex(index);
  }
}
void FileDialog::syncActive(const QModelIndex& index)
{
  listView->setCurrentIndex(index);
  treeView->setCurrentIndex(index);
  iconView->setCurrentIndex(index);
}
void FileDialog::switchView()
{
  stackedWidget->setCurrentIndex(
    (stackedWidget->currentIndex()+1)%stackedWidget->count());
}
