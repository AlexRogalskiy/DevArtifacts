#include <QtXml>
#include <QtGui>
#include <QDebug>
#include "rsshandler.h"

RssHandler::RssHandler(QStandardItemModel *model)
{
  itemModel = model;
  rssTagParsed = false;
  inItem = false;
  model->setHeaderData(0, Qt::Horizontal, QObject::tr("Title"));
  model->setHeaderData(1, Qt::Horizontal, QObject::tr("Date"));
}

bool RssHandler::startElement(const QString & /* namespaceURI */,
			      const QString & /* localName */,
			      const QString &qName,
			      const QXmlAttributes &attributes )
{
  if (!rssTagParsed && qName != "rss") {
    errString = QObject::tr("This file is not an RSS source.");
    return false;
  }

  if (qName == "rss") {
    QString version = attributes.value("version");
    if (!version.isEmpty() && version != "2.0") {
      errString = QObject::tr("Can only handle RSS 2.0.");
      return false;
    }
    rssTagParsed = true;
  } else if (qName == "item") {
    inItem = true;
    itemModel->insertRow(0);
  }
  currentText = "";
  return true;
}

bool RssHandler::characters( const QString &str )
{
  currentText += str;
  return true;
}

bool RssHandler::endElement( const QString & /* namespaceURI */,
			     const QString & /* localName */,
			     const QString &qName )
{
  if ( qName == "item" ) {
    inItem = false;
  } else if ( qName == "title" ) {
    if (inItem) {
     QModelIndex idx = itemModel->index(0,0);
     itemModel->setData(idx, currentText);
    }
  } else if ( qName == "pubDate" ) {
    if (inItem) {
     QModelIndex idx = itemModel->index(0,1);
     itemModel->setData(idx, currentText);
    }
  } else if ( qName == "description" ) {
    if (inItem) {
     QModelIndex idx = itemModel->index(0,0);
     QString preview;
     if (preview.length() >= 300 )
       preview = currentText.left(300)+"...";
     else
       preview = currentText;
     itemModel->setData(idx, preview, Qt::ToolTipRole);
     itemModel->setData(idx, currentText, Qt::UserRole);
    }
  }
  return true;
}
QString RssHandler::errorString() const
{
  return errString;
}
bool RssHandler::fatalError( const QXmlParseException &exception )
{
  QMessageBox::information( 0, QObject::tr( "RSS-Reader" ),
	   QObject::tr( "Parse error in line %1, columne %2:\n %3" )
			    .arg( exception.lineNumber() )
			    .arg( exception.columnNumber() )
			    .arg( exception.message() ) );
  return false;
}
