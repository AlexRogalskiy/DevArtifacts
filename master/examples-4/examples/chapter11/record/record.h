#ifndef RECORD_H
#define RECORD_H

#include <QString>
#include <QDataStream>
#include <QDebug>

class Record
{
    
  private:
    QString m_surname;
    QString m_name;
    QString m_street;
    int m_streetnumber;
    int m_zip;
    QString m_locality;

  public:
    Record(QString name, QString surname, QString street, 
      int streetnumber, int zip, QString locality)
    {
      m_name= name;
      m_surname = surname;
      m_street = street;
      m_streetnumber = streetnumber;
      m_zip = zip;
      m_locality = locality;
    }

    Record() {}

    QString name() const { return m_name; }
    QString surname() const { return m_surname; }
    QString street() const { return m_street; }
    int streetnumber() const { return m_streetnumber; }
    int zip() const { return m_zip; }
    QString locality() const { return m_locality; }
   
    void setName(const QString& name) { m_name = name; }
    void setSurname(const QString& surname) { m_surname = surname; }
    void setStreet(const QString& street) { m_street = street; }
    void setStreetnumber(int streetnumber) { m_streetnumber = 
streetnumber; }
    void setZip(int zip) { m_zip = zip; }
    void setLocality(const QString& locality) { m_locality = locality; }

    Record(const Record& r) {
      m_surname = r.m_surname;
      m_name = r.m_name;
      m_street = r.m_street;
      m_streetnumber = r.m_streetnumber;
      m_zip = r.m_zip;
      m_locality = r.m_locality;
    }

    Record& operator=(const Record& that) {
      m_name = that.m_name;
      m_surname = that.m_surname;
      m_street = that.m_street;
      m_streetnumber = that.m_streetnumber;
      m_zip = that.m_zip;
      m_locality = that.m_locality;
      return *this;
    }
};
QDataStream& operator<<(QDataStream &s, const Record &r)
{
  s << r.name() << r.surname() << r.street() 
    << (qint32)r.streetnumber() << (qint32)r.zip() << r.locality();
  return s;
}
QDataStream& operator>>(QDataStream &s, Record(&r))
{
  QString data;
  qint32 number;
  s >> data;
  r.setName(data); 
  s >> data;
  r.setSurname(data); 
  s >> data;
  r.setStreet(data); 
  s >> number;
  r.setStreetnumber(number); 
  s >> number;
  r.setZip(number); 
  s >> data;
  r.setLocality(data); 

  return s;
}

#endif // RECORD_H
