#include <QtGui>
#include <QtXml>
#include <QtNetwork>
#include "mainwindow.h"
#include "rsshandler.h"

MainWindow::MainWindow(QWidget *parent)
  : QMainWindow(parent), jobId(0)
{
  setWindowTitle(tr("RSS Reader"));
  QWidget *cw = new QWidget;
  QGridLayout *lay = new QGridLayout(cw);
  lineEdit = new QLineEdit;
  lay->addWidget(lineEdit, 0,0,1,2);
  treeView = new QTreeView;
  treeView->setRootIsDecorated(false);
  lay->addWidget(treeView, 1,0);
  textBrowser = new QTextBrowser;
  lay->addWidget(textBrowser, 1,1);
  setCentralWidget(cw);

  rssBuffer = new QBuffer(this);
  rssBuffer->open(QIODevice::ReadWrite);

  http = new QHttp(this);
  
  connect(lineEdit, SIGNAL(returnPressed()), SLOT(retrieveRss()));
  connect(treeView, SIGNAL(activated(const QModelIndex&)), 
		    SLOT(showArticle(const QModelIndex&)));
  connect(treeView, SIGNAL(doubleClicked(const QModelIndex&)), 
		    SLOT(showArticle(const QModelIndex&)));
  connect(http, SIGNAL(requestFinished(int, bool)), 
		    SLOT(readResponse(int, bool)));

  statusBar()->showMessage(tr("Welcome to RSS Reader!"));
}
void MainWindow::retrieveRss()
{
  QUrl url(lineEdit->text());
  if(!url.isValid() || url.scheme() != "http") {
    statusBar()->showMessage(tr("Invalid URL: '%1'")
				.arg(lineEdit->text()));
    return;
  }
  http->setHost(url.host());
  jobId = http->get(url.path(), rssBuffer);
  statusBar()->showMessage(tr("Getting RSS Feed '%1'...")
				.arg(url.toString()));
}
void MainWindow::readResponse(int id, bool error)
{
  if (id == jobId) {
    if (!error) {
      showRss();
      statusBar()->showMessage(
		tr("RSS-Feed loaded successfully"), 3000);
    }
    else
      statusBar()->showMessage(
		tr("Fehler while fetching RSS feed!"), 3000);
  }
}
void MainWindow::showRss()
{
  QStandardItemModel *model = new QStandardItemModel(0, 2);
  RssHandler handler(model);
  QXmlSimpleReader reader;
  reader.setContentHandler(&handler);
  reader.setErrorHandler(&handler);
  rssBuffer->reset();
  QXmlInputSource source(rssBuffer);
  if (!reader.parse(source))
    return;
  delete treeView->model();
  treeView->setModel(model);
}
void MainWindow::showArticle(const QModelIndex& index)
{
  QVariant tmp = treeView->model()->data(index, Qt::UserRole);
  QString content = tmp.toString();
  textBrowser->setHtml(content);
}
