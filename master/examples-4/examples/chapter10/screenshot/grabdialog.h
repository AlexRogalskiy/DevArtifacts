#ifndef GRABDIALOG_H
#define GRABDIALOG_H
#include <QDialog>
#include <QPixmap>

class QLabel;

class GrabDialog : public QDialog
{

  Q_OBJECT
  public:
    GrabDialog(QWidget *parent=0);

  protected slots:
    void prepareGrabDesktop(); 
    void grabDesktop(); 
    void printScreenshot();

  private:
    QLabel *previewLabel;
    QPixmap screenshot;
};
#endif // GRABDIALOG_H
