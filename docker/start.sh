#!/bin/sh
set -eu
if [ -f /store/reports.tar ]; then tar -C /data -xf /store/reports.tar; fi
save_reports() {
  if [ -d /data/CPN_IDE ]; then
    tar -C /data -cf /store/reports.tar.tmp CPN_IDE && mv /store/reports.tar.tmp /store/reports.tar
  fi
}
java -Duser.home=/data -jar /app/cpnide.jar --spring.config.additional-location=file:/app/docker.properties --server.port=8080 --server.address=0.0.0.0 --logging.level.com.indevstudio.cpnide.server.net=INFO &
cpn_pid=$!
(
  while kill -0 "$cpn_pid" 2>/dev/null; do sleep 15; save_reports; done
) &
backup_pid=$!
shutdown() {
  kill "$backup_pid" 2>/dev/null || true
  kill -TERM "$cpn_pid" 2>/dev/null || true
  wait "$cpn_pid" 2>/dev/null || true
  save_reports
  exit 0
}
trap shutdown TERM INT
if wait "$cpn_pid"; then status=0; else status=$?; fi
kill "$backup_pid" 2>/dev/null || true
save_reports
exit "$status"
