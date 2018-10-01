ACLOCAL_AMFLAGS = -I m4

EXTRA_DIST = README.W32

SUBDIRS = ftk flaim sql xflaim

rpms srcrpm:
	for dir in $(SUBDIRS); do \
 	  (cd $$dir && $(MAKE) $(AM_MAKEFLAGS) $@) || exit 1; \
	done

dist-hook:
	-rm -rf `find $(distdir) -name .svn`

.PHONY: rpms srcrpm
