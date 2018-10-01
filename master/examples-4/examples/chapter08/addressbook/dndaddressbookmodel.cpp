#include <QtGui>
#include "dndaddressbookmodel.h"

DndAddressbookModel::DndAddressbookModel(const QString& addresses, 
					 QObject *parent)
 : AddressbookModel(addresses, parent)
{
}

Qt::ItemFlags DndAddressbookModel::flags(const QModelIndex &index) const
{
  Qt::ItemFlags defaultFlags = AddressbookModel::flags( index );

  if (index.isValid())
    return Qt::ItemIsDragEnabled | Qt::ItemIsDropEnabled | defaultFlags;
  else
    return Qt::ItemIsDropEnabled | defaultFlags;
}
bool DndAddressbookModel::dropMimeData(const QMimeData *data,
				   Qt::DropAction action, int row,
				   int column, const QModelIndex &parent)
{

  Q_UNUSED(column);
  Q_UNUSED(parent);

  if (action == Qt::IgnoreAction)
    return true;

  if (!data->hasFormat("application/x-osp.text.csv"))
    return false;

  // workaround for Qt 4.1.2 bug
  if (row == -1)
    row = rowCount();

  QByteArray encodedData = data->data("application/x-osp.text.csv");
  QDataStream stream(&encodedData, QIODevice::ReadOnly);
  QList<QStringList> lines;
  while (!stream.atEnd())
    stream >> lines;


  int rows = lines.count();
  insertRows(row, rows, QModelIndex());
  foreach(QStringList line, lines) {
    addressBook.replace(row+1, line);
    row++;
  }
  return true;
}
QStringList DndAddressbookModel::mimeTypes() const
{
  QStringList types;
  types << "application/x-osp.text.csv";
  return types;
}
QMimeData *DndAddressbookModel::mimeData(
				const QModelIndexList &indexes) const
{
  QMimeData *mimeData = new QMimeData();

  QList<int> rows;
  foreach (QModelIndex index, indexes)
    if (index.isValid())
      if (!rows.contains(index.row())) 
        rows += index.row();

  QByteArray encodedData;
  QDataStream stream(&encodedData, QIODevice::WriteOnly);

  foreach(int row, rows)
      stream << addressBook.at(row+1);

  mimeData->setData("application/x-osp.text.csv", encodedData);
  return mimeData;
}
