#ifndef MAINWINDOW_H
#define MAINWINDOW_H

#include <QMainWindow>

class QLineEdit;
class QTextBrowser;
class QTreeView;
class QHttp;
class QBuffer;
class QModelIndex;

class MainWindow : public QMainWindow
{
  Q_OBJECT
  public:
   MainWindow(QWidget *parent=0);

  protected slots:
   void readResponse(int id, bool error);
   void retrieveRss();
   void showArticle(const QModelIndex& index);
   void showRss();

  private:
   QHttp *http;
   QLineEdit *lineEdit;
   QTextBrowser *textBrowser;
   QTreeView *treeView;
   QBuffer *rssBuffer;
   int jobId;
};

#endif // MAINWINDOW_H
