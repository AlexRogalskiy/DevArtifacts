#include <QtGui>
#include "filteringview.h"

FilteringView::FilteringView(QAbstractItemModel *model, QWidget *parent)
  : QWidget(parent)
{
  setWindowTitle(tr("Filter View"));
  proxyModel = new QSortFilterProxyModel(this);
  proxyModel->setSourceModel(model);

  QVBoxLayout *lay = new QVBoxLayout(this);
  QHBoxLayout *hlay = new QHBoxLayout;
  QLineEdit *edit = new QLineEdit;
  QComboBox *comboBox = new QComboBox;

  int modelIndex = model->columnCount(QModelIndex());
  for(int i=0; i < modelIndex; i++)
    comboBox->addItem(model->headerData(i, Qt::Horizontal, 
				Qt::DisplayRole).toString());


  hlay->addWidget(edit);
  hlay->addWidget(comboBox);

  QTreeView *view = new QTreeView;
  view->setModel(proxyModel);
  view->setAlternatingRowColors(true);

  // Make the header "clickable"
  view->header()->setClickable(true);
  // Sort Indicator festlegen
  view->header()->setSortIndicator(0, Qt::AscendingOrder);
  // Sort Indicator anzeigen
  view->header()->setSortIndicatorShown(true);
  // Initial sortieren 
  view->sortByColumn(0);

  lay->addLayout(hlay);
  lay->addWidget(view);

  connect(edit, SIGNAL(textChanged(const QString&)),
       proxyModel, SLOT(setFilterWildcard(const QString&)));

  connect(comboBox, SIGNAL(activated(int)), 
		  SLOT(setFilterKeyColumn(int)));
}
void FilteringView::setFilterKeyColumn(int col) {
  proxyModel->setFilterKeyColumn(col);
}
