#include <QtGui>

int main(int argc, char* argv[])
{
  QApplication app(argc, argv);
  QStringListModel model;
  QStringList toBuy;
  toBuy << "butter" << "milk" 
       << "cherries" << "bananas";
  model.setStringList(toBuy);
  QListView view;
  view.setModel(&model);
  view.show();
  return app.exec();
}
