#!/bin/bash
shopt -s extglob
COMPONENT=$1


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
function isError(){
  if [ $? -ne 0 ];then
      Log ERROR "编译失败"
    exit 1
  fi
}
function build(){
    Log INFO "Start ${COMPONENT} component build ..."

    Log INFO "[CMD] node_version `node -v`"
    Log INFO "[CMD] npm_version `npm -v`"

    Log INFO "[CMD] npm install"
    sudo npm install
    isError
    Log INFO "[CMD] npm run build"
    sudo npm run build
    isError
}
function clean(){
    rm -rf !(build_cd|dist|.*)
}
build
clean
