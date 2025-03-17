#!/bin/sh
set -e

PUID=${PUID:-1000}
PGID=${PGID:-1000}
USERNAME="iplayarr"

echo "Starting container with UID:$PUID and GID:$PGID"

EXISTING_GROUP=$(getent group "$PGID" | cut -d: -f1)
if [ -z "$EXISTING_GROUP" ]; then
    GROUPNAME="$USERNAME"
    addgroup -g "$PGID" "$GROUPNAME"
else
    GROUPNAME="$EXISTING_GROUP"
fi

EXISTING_USER=$(getent passwd "$PUID" | cut -d: -f1)
if [ -z "$EXISTING_USER" ]; then
    adduser -D -u "$PUID" -G "$GROUPNAME" "$USERNAME"
    EXISTING_USER="$USERNAME"
fi

find /app \! -user $PUID \! -group $PGID -exec chown "${EXISTING_USER}":"${GROUPNAME}" {} \;
exec su-exec "$EXISTING_USER" "$@"