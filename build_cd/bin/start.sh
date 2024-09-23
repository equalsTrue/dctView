#!/bin/bash
#author ivan

source /etc/profile
echo "DEPLOY_ENV=${DEPLOY_ENV}"
curdir=$(cd "$(dirname "$0")"; pwd)

DEPLOY_LOG=$1
#rm -rf /data/www/*
#cp -r dist/* /data/www
mkdir -p /data/www/ladder-manager
rm -rf /data/www/ladder-manager/*
cp -r dist/* /data/www/ladder-manager

