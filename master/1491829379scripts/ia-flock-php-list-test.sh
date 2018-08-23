#!/bin/sh
INDLOG=index7.log
php update.php &
for i in 1 2 3 4 5; do echo -n "$i"; sleep 1; done
echo "***************" >>$INDLOG
echo "*** PHASE 1 ***" >>$INDLOG
echo "***************" >>$INDLOG
php index.php >>$INDLOG
for i in 1 2 3 4 5; do echo -n "$i"; sleep 1; done
echo "***************" >>$INDLOG
echo "*** PHASE 2 ***" >>$INDLOG
echo "***************" >>$INDLOG
php index.php >>$INDLOG
