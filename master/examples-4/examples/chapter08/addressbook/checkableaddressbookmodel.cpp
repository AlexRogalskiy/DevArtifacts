#include <QtGui>
#include "checkableaddressbookmodel.h"
CheckableAddressbookModel::CheckableAddressbookModel(
			const QString& addresses, QObject *parent)
 : AddressbookModel(addresses, parent)
{
  // Contrary to what we've done in the AddressbookModel,
  // we don't add 1 to the index here
  // since the headers can't be checked by the user 
  int rows = addresses.count('\n');
  for ( int i = 0; i < rows; i++) {
     checkedStates.append(false);
  }
}
Qt::ItemFlags CheckableAddressbookModel::flags
				(const QModelIndex &index) const {
    if (!index.isValid())
        return 0;

    if (index.column() == 0)
      return AddressbookModel::flags(index)| Qt::ItemIsUserCheckable;
    else
      return AddressbookModel::flags(index);
}
QVariant CheckableAddressbookModel::data(
			const QModelIndex &index, int role) const
{
  if (!index.isValid()) return QVariant();

  if (role == Qt::CheckStateRole && index.column() == 0) {
    if (checkedStates[index.row()] == true)
      return Qt::Checked;
    else
      return Qt::Unchecked;
  }
  return AddressbookModel::data(index,role);
}
bool CheckableAddressbookModel::setData(const QModelIndex & index, 
					const QVariant& value, int role)
{
  if (!index.isValid()) return false;

  if (role == Qt::CheckStateRole && index.column() == 0) {
    checkedStates[index.row()] = !checkedStates[index.row()];
    emit dataChanged(index, index);
    return true;
  }

  return AddressbookModel::setData(index, value, role);
}
