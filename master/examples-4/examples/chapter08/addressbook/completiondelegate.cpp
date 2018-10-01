#include <QtGui>
#include "completiondelegate.h"

CompletionDelegate::CompletionDelegate(QObject *parent)
  : QItemDelegate(parent)
{
}
QWidget *CompletionDelegate::createEditor(QWidget* parent,
			const QStyleOptionViewItem& option,
			const QModelIndex& index ) const
{
  const QAbstractItemModel *model = index.model();
  if (!model) 
    return QItemDelegate::createEditor(parent, option, index);

  QComboBox *box = new QComboBox(parent);
  box->setEditable(true);
  box->setAutoCompletion(true);
  box->setModel(const_cast<QAbstractItemModel*>(model));
  box->setModelColumn(index.column());
  box->installEventFilter(const_cast<CompletionDelegate*>(this));
  return box;
}
void CompletionDelegate::setEditorData(QWidget* editor, 
				const QModelIndex & index ) const
{
  QComboBox* box = qobject_cast<QComboBox*>(editor);
  const QAbstractItemModel *model = index.model();

  if (!box || !model)
    QItemDelegate::setEditorData(editor, index);
  box->setCurrentIndex(index.row());
}
void CompletionDelegate::setModelData(QWidget *editor, 
				QAbstractItemModel *model, 
				const QModelIndex &index) const
{
  if (!index.isValid())
    return;

  QComboBox* box = qobject_cast<QComboBox*>(editor);
  if (!box)
    return QItemDelegate::setModelData(editor, model, index);

  model->setData(index, box->currentText(), Qt::DisplayRole);
  model->setData(index, box->currentText(), Qt::EditRole);
}
