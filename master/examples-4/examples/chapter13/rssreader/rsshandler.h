#ifndef RSSHANDLER_H
#define RSSHANDLER_H

#include <QXmlDefaultHandler>
#include <QString>
#include <QModelIndex>

class QDocumentModel;
class QStandardItemModel;
class QXmlParseException;

class RssHandler : public QXmlDefaultHandler
{
  public:
    RssHandler(QStandardItemModel *model);

    bool startElement(const QString &namespaceURI, 
	const QString &localName, const QString &qName, 
	const QXmlAttributes &attributes);
    bool endElement(const QString &namespaceURI, 
	const QString &localName, const QString &qName);
    bool characters(const QString &str);
    bool fatalError(const QXmlParseException &exception);
    QString errorString() const;

  private:
    bool rssTagParsed, inItem;
    QStandardItemModel *itemModel; 
    QString errString;
    QString currentText;
};

#endif // RSSHANDLER_H
