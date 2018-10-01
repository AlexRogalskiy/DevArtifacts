#ifndef CHECKABLEADDRESSBOOKMODEL_H
#define CHECKABLEADDRESSBOOKMODEL_H

#include "addressbookmodel.h" 
#include <QList>
class CheckableAddressbookModel : public AddressbookModel 
{
  Q_OBJECT
  public:
    CheckableAddressbookModel(const QString& addresses, 
				QObject *parent = 0);
    virtual QVariant data ( const QModelIndex & index, 
				int role = Qt::DisplayRole ) const;
    virtual bool setData(const QModelIndex & index, 
			const QVariant & value, int role = Qt::EditRole);
    virtual Qt::ItemFlags flags(const QModelIndex &index) const;
  private:
    QList<bool> checkedStates;
};
#endif //CHECKABLEADDRESSBOOKMODEL_H
