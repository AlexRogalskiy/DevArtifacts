#ifndef MAINWINDOW_H
#define MAINWINDOW_H

#include <QMainWindow>
#include "ui_mainwindow.h"

class QLabel;

class MainWindow : public QMainWindow, 
                   private Ui::MainWindow
{
  Q_OBJECT
  public:
    MainWindow(QWidget *parent = 0);
    ~MainWindow();

  protected:
    void setupActions();

  protected:
  void writeSettings();
  void readSettings();
  protected:
    bool mayDiscardDocument();
    void saveFile(const QString&);
  protected slots:
    void newFile();
    void loadFile();
    void saveFile();
    void saveFileAs();
    void undo();
    void redo();
    void copy();
    void about();
    void updateStats();
  private:
    QString mFilePath;
    QLabel *mStatLabel;
};
#endif // MAINWINDOW_H
