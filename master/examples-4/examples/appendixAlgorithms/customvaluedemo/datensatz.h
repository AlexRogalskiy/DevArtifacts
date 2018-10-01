#ifndef DATENSATZ_H
#define DATENSATZ_H

#include <QString>
#include <QHash>

class Record {
  public:
    Record(const QString &surname, const QString &forename)
    {
      m_forename = forename;
      m_surname = surname;
    }

    QString forename() const { return m_forename; }
    QString surname() const { return m_surname; }

  private:
    QString m_forename;
    QString m_surname;
};
inline bool operator<(const Record &e1, const Record &e2)
{
  if ( e1.surname() != e2.surname() )
    return e1.surname() < e2.surname();
  return e1.forename() < e2.forename();
}
inline bool operator==(const Record &e1, const Record &e2)
{
   return (e1.surname() == e2.surname())
       && (e1.forename() == e2.forename());
}

inline uint qHash(const Record& key)
{
   return qHash(key.surname()) ^ qHash(key.forename());
}

#endif // DATASET_H
