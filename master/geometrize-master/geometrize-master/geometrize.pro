QT += core gui network svg

TARGET = Geometrize
TEMPLATE = app

# Enable C++14 features
CONFIG += c++14

# Disable assertions in release builds (for gcc, clang etc builds)
CONFIG(release, debug|release): DEFINES += NDEBUG

# Flag for ChaiScript linking
# Note that mingw32 builds may not work with the compiled-in stdlib because of a "too many sections error" with Chaiscript
msvc:QMAKE_CXXFLAGS += -bigobj

# Options for the Universal Windows Platform version of Geometrize
winrt {
    include($$PWD/uwp/geometrize_uwp.pri)
}

# Options for the Mac AppStore version of Geometrize
macx {
    include($$PWD/osx/geometrize_osx.pri)
}

# Some versions of gcc have linker issues like:
# //lib/x86_64-linux-gnu/libdl.so.2: error adding symbols: DSO missing from command line
linux {
    *-g++* {
        LIBS += -ldl
    }
}

# Include library dependencies
INCLUDEPATH += $$PWD/lib/cereal/include \
    $$PWD/lib/chaiscript/include

include($$PWD/lib/geometrize/geometrize/geometrize.pri)
include($$PWD/lib/burstlinker/burstlinker.pri)

# Include the Geometrize headers, sources, UI forms
include($$PWD/geometrize/sources.pri)

# Generate localization TS files and then binary QM files, which it puts into the resources folder
include($$PWD/translations/translations.pri)

# Include resources that Geometrize requires, such as icons, images and scripts
# Note this must come last, as resource files are automatically generated
include($$PWD/resources/resources.pri)
