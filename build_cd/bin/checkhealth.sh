#!/bin/bash
#author ivan
VERSION=$1
source /etc/profile
if [ "${DEPLOY_ENV}" = "fat" ];then
    SERVER_URL="http://sandbox.new.ladder-manager.starpavilion-digital.com/#/version-info"
elif [ "${DEPLOY_ENV}" = "prod" ];then
    SERVER_URL="http://ladder-manager.starpavilion-digital.com/#/version-info"
fi
function Log(){
    dateFormat=`date "+%Y-%m-%d %H:%M:%S"`
    level="INFO"
    messageShow="message is null"
    if [[ $1 != "" ]];then
        typeset -u level=$1
    fi
    if [[ $2 != "" ]];then
        messageShow=$2
    fi
    printf "[%s] %s %s\n" "$level" "$dateFormat" "$messageShow"
}

#效验成功返回0，失败返回1
function health_check(){
    echo "[health_check] no health check"
    # Check service request, return 200
    http_code=$(curl -I -m 10 -o /dev/null -s -w %{http_code} "${SERVER_URL}")
    if [[ ${http_code} != 200 ]];then
        Log ERROR "Check service request (ELB/nginx), failed"
        return 1
    else
        Log INFO "Check service request (ELB/nginx), successful"
    fi
    # Check the version number in the js files
    #result=$(find /data/www/static/js -type f -name "*.js"|xargs grep ${VERSION})
    #if [[ ${result} != "" ]];then
    #    Log INFO "Successful. The version number ${VERSION} is already in the js files"
    #else
    #    Log ERROR "Failed. The version number ${VERSION} does not exist in the js files"
    #    return 1
    #fi
}
health_check