1. ??????????????
   a. ?????? java 1.8
   b. ?????? codedeploy ?????
   c. ??????? ???????????DEPLOY_ENV(/etc/profile): --spring.profiles.active=${DEPLOY_ENV}
2. ????????????????????????gitlab?????????????
    build_cd/
    ?????? bin
    ??   ?????? checkhealth.sh #???????
    ??   ?????? start.sh #???????(??????????)
    ??   ?????? stop.sh #?????
    ?????? build.sh #?????????????????????
    ?????? readMe.txt
    ?????? S3_Revision #AWS codedeploy-agent ?????????????????
        ?????? appspec.yml
        ?????? scripts
            ?????? AfterInstall.sh
            ?????? ApplicationStart.sh
            ?????? ApplicationStop.sh
            ?????? DeleteWar.sh
            ?????? UpdateApiDoc.sh
            ?????? ValidateService.sh
3.  ?????????????????????????http://gitlab.starpavilion-digital.com/mobilecontent-cloud/cd.git??
    cd/
    ?????? {project}
    ??   ?????? conf.sh #??????????gitlab??????????????????????????region??????
    
4.  ?????????????????
5.  ????????
    ?????????/feige/deploy/${PROJECT_NAME}/${component}
    ?????????/feige/deploy/deployfile/${PROJECT_NAME}/bak/tar
    ????????/pdata1/${PROJECT_NAME}  #??????log4j????
    ?????????/opt/codedeploy-agent/deployment-root/deployment-logs/codedeploy-agent-deployments.log