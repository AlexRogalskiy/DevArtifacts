eggtrayiconincdir = $(includedir)/libeggtrayicon

lib_LTLIBRARIES = libeggtrayicon.la

eggtrayiconinc_HEADERS = \
	eggtrayicon.h

noinst_HEADERS = \
	eggmarshalers.h

libeggtrayicon_la_SOURCES = \
	eggtrayicon.c \
	eggmarshalers.c

libeggtrayicon_la_LIBADD = $(PACKAGE_LIBS)

libeggtrayicon_la_LDFLAGS = \
        -version-info $(LT_CURRENT):$(LT_REVISION):$(LT_AGE)

eggmarshalers.h: eggmarshalers.list
	cd $(srcdir) \
	&& $(GLIB_GENMARSHAL) --prefix=_egg_marshal eggmarshalers.list --header > xgen-emh \
	&& cp xgen-emh eggmarshalers.h \
	&& rm -f xgen-emh xgen-emh~

eggmarshalers.c: eggmarshalers.list
	cd $(srcdir) \
	&& $(GLIB_GENMARSHAL) --prefix=_egg_marshal eggmarshalers.list --body > xgen-emc \
	&& cp xgen-emc eggmarshalers.c \
	&& rm -f xgen-emc xgen-emc~

INCLUDES = \
        -I$(top_srcdir) \
	-DG_LOG_DOMAIN=\"eggtrayicon\" \
	-DGETTEXT_PACKAGE=\"libegg\" \
	$(PACKAGE_CFLAGS)

EXTRA_DIST = \
	eggmarshalers.list
