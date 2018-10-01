#ifndef ADDRESSBOOKMODEL_H
#define ADDRESSBOOKMODEL_H

#include <QAbstractTableModel>
#include <QStringList>

class AddressbookModel : public QAbstractTableModel
{
  Q_OBJECT
  public:
    AddressbookModel(const QString& addresses, QObject *parent = 0);
    virtual QVariant headerData (int section, Qt::Orientation orientation, int role = Qt::DisplayRole ) const;
    virtual int rowCount ( const QModelIndex & parent = QModelIndex() ) const;
    virtual int columnCount ( const QModelIndex & parent = QModelIndex() ) const;
    virtual QVariant data ( const QModelIndex & index, int role = Qt::DisplayRole ) const;

    virtual bool setData(const QModelIndex & index, const QVariant & value, int role = Qt::EditRole);
    virtual bool removeRows(int row, int count, const QModelIndex & parent = QModelIndex());
    virtual bool insertRows(int row, int count, const QModelIndex & parent = QModelIndex());
    virtual Qt::ItemFlags flags(const QModelIndex &index) const;

    QString toString() const;

  private:
    QList<QStringList> addressBook;
    QList<bool> checkedStates;
};
#endif //ADDRESSBOOKMODEL_H
