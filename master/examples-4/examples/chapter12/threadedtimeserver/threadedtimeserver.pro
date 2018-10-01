TEMPLATE = app

# Input
HEADERS += connectionthread.h timeserver.h
SOURCES += connectionthread.cpp main.cpp timeserver.cpp
QT += network

DESTDIR = ../../../bin/chapter12
