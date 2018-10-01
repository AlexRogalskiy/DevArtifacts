#include <QtGui>
#include "addressbookmodel.h"

QStringList splitCSVLine(const QString& line)
{
  bool inItem = false;
  QStringList items;
  QString item;

  for (int pos = 0; pos < line.length(); pos++)
  {
    QChar c = line.at(pos);
    if ( c == '\'') {
      if (inItem) {
        items.append(item);
        item = "";
      }
      inItem = !inItem;
    }
    else 
      if (inItem) {
         item += c;
      }
  }
  return items;
}

AddressbookModel::AddressbookModel(const QString& addresses, 
 QObject *parent): QAbstractTableModel(parent)
{
  QStringList records = addresses.split('\n');
  QStringList line;
  foreach(QString record, records)
     addressBook.append(splitCSVLine(record));
}

int AddressbookModel::rowCount(const QModelIndex &parent ) const
{
  Q_UNUSED(parent);
  return addressBook.count() - 2;
}
int AddressbookModel::columnCount(const QModelIndex &parent ) const
{
    Q_UNUSED(parent);
    return addressBook.at(0).count();
}
QVariant AddressbookModel::headerData(int section, 
			Qt::Orientation orientation, int role) const
{
  if (orientation == Qt::Horizontal) {
    if (role == Qt::DisplayRole) {
      return addressBook.at(0).at(section);
    }
  }
  return QAbstractTableModel::headerData(section, orientation, role);
}
QVariant AddressbookModel::data(const QModelIndex &index, 
						int role) const
{
  if (!index.isValid()) return QVariant();
  QStringList addressRecord = addressBook.at(index.row()+1);
  if (role == Qt::DisplayRole || role == Qt::EditRole) {
    return addressRecord.at(index.column());
  }
  if (role == Qt::ToolTipRole) {
    QString tip, key, value;
    tip = "<table>";
    int maxLines = addressRecord.count();
    for (int i = 0; i < maxLines; i++) {
       key = headerData(i, Qt::Horizontal, Qt::DisplayRole)
						.toString();
       value = addressRecord.at(i);
       if (!value.isEmpty()) 
          tip += QString("<tr><td><b>%1</b>: %2</td></tr>")
						.arg(key, value);
    }
    tip += "</table>";
    return tip;
  }
  return QVariant();
}
Qt::ItemFlags AddressbookModel::flags(const QModelIndex &index) const
{
    if (!index.isValid())
        return 0;

    return QAbstractItemModel::flags(index) | Qt::ItemIsEditable;
}
bool AddressbookModel::setData(const QModelIndex & index, 
				const QVariant& value, int role)
{
  if (index.isValid() && (role == Qt::EditRole || 
                          role == Qt::DisplayRole)) {
    // add 1 to the row index to skip over the header
    addressBook[index.row()+1][index.column()] = value.toString();
    emit dataChanged(index, index);
    return true;
  }
  return false;
}
bool AddressbookModel::insertRows(int row, int count, 
					const QModelIndex & parent)
{
  Q_UNUSED(parent);
  QStringList emptyRecord;
  for (int i=0; i<columnCount(QModelIndex()); i++)
    emptyRecord.append(QString());
  beginInsertRows(QModelIndex(), row, row+count-1);
  for (int i=0; i<count; i++)
    addressBook.insert(row+1, emptyRecord);
  endInsertRows();

  return true;
}

bool AddressbookModel::removeRows(int row, int count, 
					const QModelIndex& parent)
{
  Q_UNUSED(parent);
  if (row-count-1 > addressBook.count()-1) return false;
  beginRemoveRows(QModelIndex(), row, row+count-1);
  for(int i=0; i<count; i++)
    addressBook.removeAt(row+1);
  endRemoveRows();
  return true;
}
QString AddressbookModel::toString() const
{
   QString ab;
   foreach (QStringList record, addressBook) {
     ab += "\"";
     record.join("\",\"");
     ab += "\"\n";
   }
   return ab;
}
