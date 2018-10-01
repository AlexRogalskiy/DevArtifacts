TransposeProxyModel::TransposeProxyModel(QObject *parent)
  : QAbstractProxyModel(parent)
{
}
QModelIndex TransposeProxyModel::mapFromSource(
				const QModelIndex& sourceIndex) const
{
  return index(sourceIndex.column(), sourceIndex.row());
}

QModelIndex TransposeProxyModel::mapToSource(
				const QModelIndex& proxyIndex) const
{
  return sourceModel()->index(proxyIndex.column(), proxyIndex.row());
}
QModelIndex TransposeProxyModel::index(int row, int column, 
				const QModelIndex& parent) const
{
  Q_UNUSED(parent);
  return createIndex(row, column);
}
QModelIndex TransposeProxyModel::parent(
				const QModelIndex& index) const
{
  Q_UNUSED(index);
  return QModelIndex();
}
int TransposeProxyModel::rowCount(const QModelIndex& parent) const
{
  return sourceModel()->columnCount(parent);
}

int TransposeProxyModel::columnCount(const QModelIndex& parent) const
{
  return sourceModel()->rowCount(parent);
}
QVariant TransposeProxyModel::data(const QModelIndex& index, 
					int role) const
{
  if (!index.isValid()) return QVariant();
  return sourceModel()->data(mapToSource(index), role);
}
QVariant TransposeProxyModel::headerData(int section, 
			Qt::Orientation orientation, int role) const
{ 
  if (orientation == Qt::Horizontal)
    return sourceModel()->headerData(section, Qt::Vertical, role);
  else
    return sourceModel()->headerData(section, Qt::Horizontal, role);
}

