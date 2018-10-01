#ifndef CHATWINDOW_H
#define CHATWINDOW_H

#include <QWidget>

class QTextBrowser;
class QTextEdit;
class QEvent;

class ChatWindow : public QWidget 
{
  Q_OBJECT
  public:
    ChatWindow(QWidget *parent = 0);
    bool eventFilter(QObject *watched, QEvent *e);
    void submitChatText();

  private:
    QTextBrowser *conversationView;
    QTextEdit *chatEdit;
};
#endif // CHATWINDOW_H
