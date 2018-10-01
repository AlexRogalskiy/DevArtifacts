#include <QtCore>
#include <stdlib.h>
#include <QDebug>

class StoringThread : public QThread
{

  private:
    QThreadStorage<QList<QTime>*> storage;

  public:
    StoringThread(QObject *parent=0) 
     : QThread(parent) {}

  protected:
    void run()
    {
      forever {
        if (!storage.hasLocalData()) {
          storage.setLocalData(new QList<QTime>);
          qDebug() << objectName() << ": Creating list." 
                   << "Pointer:" << storage.localData();
        }
        storage.localData()->append(QTime::currentTime());
        qDebug() << objectName() << ":" 
                 << storage.localData()->count() << "dates collected";
        msleep((rand()%2000)+1);
      };
    }
};
int main()
{
  StoringThread thread1;
  StoringThread thread2;
  StoringThread thread3;
  thread1.setObjectName("thread1");
  thread2.setObjectName("thread2");
  thread3.setObjectName("thread3");
  thread1.start();
  thread2.start();
  thread3.start();
  thread1.wait();
  thread2.wait();
  thread3.wait();
  return 0;
}
