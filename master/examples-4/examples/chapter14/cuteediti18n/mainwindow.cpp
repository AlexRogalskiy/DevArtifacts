#include <QtGui>
#include "mainwindow.h"

MainWindow::MainWindow(QWidget *parent)
 : QMainWindow(parent)
{
  setupUi(this);
  setupActions();

  mStatLabel = new QLabel;
  statusBar()->addPermanentWidget(mStatLabel);
  connect(textEdit, SIGNAL(textChanged()), this, SLOT(updateStats()));
  updateStats();
}
void MainWindow::setupActions()
{
  menu_Bearbeiten->addSeparator();
  menu_Bearbeiten->addAction(toolBar->toggleViewAction());

  connect(action_quit, SIGNAL(triggered(bool)),
          qApp, SLOT(quit()));
  connect(action_open, SIGNAL(triggered(bool)),
          this, SLOT(loadFile()));
  connect(action_save, SIGNAL(triggered(bool)),
          this, SLOT(saveFile()));
  connect(action_saveas, SIGNAL(triggered(bool)),
          this, SLOT(saveFileAs()));

  connect(textEdit, SIGNAL(copyAvailable(bool)),
          action_copy, SLOT(setEnabled(bool)));
  connect(textEdit, SIGNAL(undoAvailable(bool)),
          action_undo, SLOT(setEnabled(bool)));
  connect(textEdit, SIGNAL(redoAvailable(bool)),
          action_redo, SLOT(setEnabled(bool)));

  connect(action_copy, SIGNAL(triggered(bool)),
          this, SLOT(copy()));
  connect(action_undo, SIGNAL(triggered(bool)),
          this, SLOT(undo()));
  connect(action_redo, SIGNAL(triggered(bool)),
          this, SLOT(redo()));

  connect(action_about, SIGNAL(triggered(bool)),
          this, SLOT(about()));
}

MainWindow::~MainWindow()
{
}
bool MainWindow::mayDiscardDocument()
{
  if (textEdit->document()->isModified()) {
    QString filename = mFilePath;
    if (filename.isEmpty()) filename = tr("Untitled");
    if (QMessageBox::question(this, tr("Save Document"),
      tr("You want to create a new document, but "
         "you have unsaved changes in the current document "
         "%1'. How do you want to proceed?"), 
	 tr("Save Document"), tr("Discard Changes") ))
      saveFile();
      return true;
  }
  return false;
}

void MainWindow::newFile()
{
  if (!mayDiscardDocument()) return;
  textEdit->setPlainText("");
  mFilePath = "";
}

void MainWindow::loadFile()
{
  QString filename = QFileDialog::getOpenFileName(this);
  QFile file(filename);
  if (file.open(QIODevice::ReadOnly|QIODevice::Text)) {
    textEdit->setPlainText(QString::fromUtf8(file.readAll()));
    mFilePath = filename;
    statusBar()->showMessage(tr("File loaded successfully."), 3000);
  }
}

void MainWindow::saveFile()
{
  if(mFilePath.isEmpty()) 
    saveFileAs();
  else
    saveFile(mFilePath);
}

void MainWindow::saveFile(const QString &name)
{
  QFile file(name);
  if (file.open(QIODevice::WriteOnly|QIODevice::Text)) {
    file.write(textEdit->toPlainText().toUtf8());
    statusBar()->showMessage(tr("File saved successfully."), 3000);
  }
}


void MainWindow::saveFileAs()
{
  mFilePath = QFileDialog::getSaveFileName(this);
  if(mFilePath.isEmpty())
    return;
  saveFile(mFilePath);
}
void MainWindow::undo()
{
  textEdit->document()->undo();
}
void MainWindow::redo()
{
  textEdit->document()->redo();
}
void MainWindow::copy()
{
  textEdit->copy();
}

void MainWindow::about()
{
  QMessageBox::about(this, tr("About CuteEdit"), 
		tr("CuteEdit 1.0\nA Qt application example.\n"
		   "(c) 2006 Daniel Molkentin, Open Source Press"));
}
void MainWindow::writeSettings()
{
  QSettings settings;
  settings.setValue("MainWindow/Size", size());
  settings.setValue("MainWindow/Properties", saveState());
}

void MainWindow::readSettings()
{
  QSettings settings;
  resize(settings.value("MainWindow/Size", sizeHint()).toSize());
  restoreState(settings.value("MainWindow/Properties").toByteArray());
}

void MainWindow::updateStats()
{
  QString text = textEdit->document()->toPlainText();
  int chars = text.length();
  text = text.simplified();
  int words = 0;
  words = text.count(" ");
  if (!text.isEmpty()) words++;
  QString output = tr("Characters: %1, Words: %2").arg(chars).arg(words); 
  mStatLabel->setText(output);
}
