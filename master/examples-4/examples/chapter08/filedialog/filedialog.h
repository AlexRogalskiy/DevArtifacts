#ifndef FILEDIALOG_H
#define FILEDIALOG_H

#include "ui_filedialog.h"

class QModelIndex;
class QDirModel;
class QItemSelectionModel;

class FileDialog: public QDialog, private Ui::FileDialog {
  Q_OBJECT
  public:
    FileDialog(QWidget *parent = 0);
    QStringList selectedFiles();

  protected slots:
    void switchToDir(const QModelIndex& index);
    void syncActive(const QModelIndex& index);
    void switchView();

  private:
    QItemSelectionModel *selModel;
    QDirModel *dirModel;
};

#endif // FILEDIALOG_H
