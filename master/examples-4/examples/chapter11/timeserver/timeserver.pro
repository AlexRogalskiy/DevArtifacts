TEMPLATE = app

# Input
HEADERS += connectionhandler.h timeserver.h
SOURCES += main.cpp timeserver.cpp
QT += network

DESTDIR = ../../../bin/chapter11
