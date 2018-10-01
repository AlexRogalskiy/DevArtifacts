#include <QtCore>
#include <QDebug>

QQueue<int> g_queue;
int g_maxlen;
QMutex g_mutex;
QWaitCondition g_queueNotFull;
QWaitCondition g_queueNotEmpty;
class Producer : public QThread
{
  public:
    Producer(QObject *parent=0) 
      : QThread(parent) {}

  protected:
    void produceMessage()
    {
       qDebug() << "Producing...";
       g_mutex.lock();
       if (g_queue.size() == g_maxlen) {
         qDebug() << "g_queue is full, waiting!";
         g_queueNotFull.wait(&g_mutex);
       }

       g_queue.enqueue((rand()%100)+1);
       g_queueNotEmpty.wakeAll();
       g_mutex.unlock();
    }

    void run()
    {
      forever {
        produceMessage();
        msleep((rand()%3000)+1);
      };
    }
};
class Consumer : public QThread
{
  public:
    Consumer(QObject *parent=0) 
      : QThread(parent) {}

  protected:
    int consumeMessage()
    {
       qDebug() << "Consuming...";
       QMutexLocker locker(&g_mutex);
       if (g_queue.isEmpty()) {
         qDebug() << "g_queue empty, waiting!";
         g_queueNotEmpty.wait(&g_mutex);
       }
       int val = g_queue.dequeue();
       g_queueNotFull.wakeAll();
       return val;
    }

    void run()
    {
      forever {
        qDebug() << consumeMessage();
        msleep(( rand()%4000 )+1);
      }
    }
};
int main()
{
  g_maxlen = 10;
  Producer producer;
  Consumer consumer;
  producer.start();
  consumer.start();
  producer.wait();
  consumer.wait();
  return 0;
}
