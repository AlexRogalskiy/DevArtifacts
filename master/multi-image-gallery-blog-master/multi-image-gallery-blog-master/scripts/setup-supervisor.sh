SCRIPT=`realpath $0`
SCRIPTPATH=`dirname $SCRIPT`
PROJECT_ROOT=`realpath "$SCRIPTPATH/../"`

resize_worker_block="[program:resize-worker]
process_name=%(program_name)s_%(process_num)02d
command=php $PROJECT_ROOT/bin/console app:resize-image-worker
autostart=true
autorestart=true
numprocs=5
stderr_logfile = $PROJECT_ROOT/var/log/resize-worker-stderr.log
stdout_logfile = $PROJECT_ROOT/var/log/resize-worker-stdout.log"

echo "$resize_worker_block" > "/etc/supervisor/conf.d/resize-worker.conf"
supervisorctl reread
supervisorctl update
