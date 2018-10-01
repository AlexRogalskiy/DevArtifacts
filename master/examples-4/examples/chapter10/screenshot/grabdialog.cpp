#include <QtGui>
#include "grabdialog.h"

GrabDialog::GrabDialog(QWidget *parent)
  : QDialog(parent)
{
  QGridLayout *lay = new QGridLayout(this);
  previewLabel = new QLabel;
  previewLabel->setFixedSize(300,200);
  lay->addWidget(previewLabel, 0, 0, 1, 2);
  QPushButton *screenshotBtn = new QPushButton(tr("&Screenshot!"));
  QPushButton *printBtn= new QPushButton(tr("&Print"));
  lay->addWidget(screenshotBtn, 1, 0);
  lay->addWidget(printBtn, 1, 1);
  connect(screenshotBtn, SIGNAL(clicked()), SLOT(prepareGrabDesktop()));
  connect(printBtn, SIGNAL(clicked()), SLOT(printScreenshot()));
  grabDesktop();
  setWindowTitle(tr("Screenshot"));
}
void GrabDialog::prepareGrabDesktop()
{
  hide();
  QTimer::singleShot(500, this, SLOT(grabDesktop()));
}
void GrabDialog::grabDesktop()
{
  QDesktopWidget *w = qApp->desktop();
  screenshot= QPixmap::grabWindow(w->screen()->winId());
  previewLabel->setPixmap(screenshot.scaled(previewLabel->size()));
  screenshot.save("screenshot.png", "PNG");
  show();
}
void GrabDialog::printScreenshot()
{	
  QPrinter printer;
  printer.setOrientation(QPrinter::Landscape);
  QPrintDialog dlg(&printer, this);
  if (dlg.exec() == QDialog::Accepted) {
    printer.newPage();
    QPainter p(&printer);
    QPixmap resized = screenshot.scaledToWidth(
		    	printer.pageRect().width());
    p.drawPixmap(0,0, resized);
    p.end();
  } 
}
