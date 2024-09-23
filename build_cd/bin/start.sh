#!/bin/bash
#author ivan

source /etc/profile
echo "DEPLOY_ENV=${DEPLOY_ENV}"
curdir=$(cd "$(dirname "$0")"; pwd)

DEPLOY_LOG=$1
#rm -rf /data/www/*
#cp -r dist/* /data/www
mkdir -p /data/www/DCT-manager
rm -rf /data/www/DCT-manager/*
cp -r dist/* /data/www/DCT-manager

