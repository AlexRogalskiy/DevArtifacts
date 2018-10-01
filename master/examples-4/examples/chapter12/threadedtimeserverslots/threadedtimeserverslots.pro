TEMPLATE = app

# Input
HEADERS += loggerthread.h
SOURCES += connectionthread.cpp loggerthread.cpp main.cpp timeserver.cpp
QT += network

DESTDIR = ../../../bin/chapter12
