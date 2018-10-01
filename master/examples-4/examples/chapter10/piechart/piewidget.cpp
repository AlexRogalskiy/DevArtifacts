#include <QtGui>
#include "piewidget.h"

PieWidget::PieWidget(QWidget *parent)
 : QWidget(parent)
{
}

void PieWidget::addEntry(const QString& key, int val) {
  values.insert(key, val);
}
void PieWidget::paintEvent(QPaintEvent * /*ev*/)
{
  // calculate total 
  QHash<QString, int>::const_iterator it;
  int total = 0;
  for(it = values.begin(); it != values.end(); ++it)
    total += it.value();

  // prepare painter
  QPainter p(this);
  p.setRenderHint(QPainter::Antialiasing, true);
  // prepare colors 
  QStringList colorNames = QColor::colorNames();
  int colorPos = 13; // pastel colors 

  int height = rect().height();
  QRect pieRect(0, 0, height, height);

  // dedicate right half to legend
  QRect legendRect = rect();
  legendRect.setLeft(pieRect.width());
  legendRect.adjust(10,10,-10,-10);
  int lastAngleOffset = 0;
  int currentPos = 0;

  // create an entry for every piece of the pie
  for(it = values.begin(); it != values.end(); ++it) {
    int value = it.value();
    QString text = it.key();

    int angle = (int)(16*360*(value/(double)total));
    QColor col(colorNames.at(colorPos%colorNames.count()));
    colorPos++;

    // gradient for the pie pieces
    QRadialGradient rg(pieRect.center(), pieRect.width()/2,
                       pieRect.topLeft());
    rg.setColorAt(0, Qt::white);
    rg.setColorAt(1, col);
    p.setBrush(rg);
    QPen pen = p.pen();
    p.setPen(Qt::NoPen);
    p.drawPie(pieRect, lastAngleOffset, angle);
    lastAngleOffset += angle;
    // calculate the squares for the legend
    int fh = fontMetrics().height();
    QRect legendEntryRect(0,(fh*2)*currentPos,fh,fh);
    currentPos++;
    legendEntryRect.translate(legendRect.topLeft());

    // define gradient for the legend squares
    QLinearGradient lg(legendEntryRect.topLeft(),
                       legendEntryRect.bottomRight());
    lg.setColorAt(0, col);
    lg.setColorAt(1, Qt::white);
    p.setBrush(QBrush(lg));
    p.drawRect(legendEntryRect);
    // draw text behind squares
    QPoint textStart = legendEntryRect.topRight();
    textStart = textStart + QPoint(fontMetrics().width('x'), 0);
    QPoint textEnd(legendRect.right(), legendEntryRect.bottom());
    QRect textEntryRect(textStart, textEnd);
    p.setPen(pen);
    p.drawText(textEntryRect, Qt::AlignVCenter, text);
  }
}
QSize PieWidget::minimumSizeHint() const
{
  int fh = fontMetrics().height();
  int height = fh*2*values.count();
  int longest = 0;
  QHash<QString, int>::const_iterator it;
  QFontMetrics fm = fontMetrics();
  for(it = values.begin(); it != values.end(); ++it)
    longest = qMax(fm.width(it.key()), longest);
  int width = height+longest+fm.width('x')+(2*10);
  QSize minSize(width, height);
  return minSize;
}

QSize PieWidget::sizeHint() const
{
  return minimumSizeHint();
}
