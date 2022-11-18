#!/bin/sh
#MAIN_MODULE指AndroidStudio工程目录下面主module
MAIN_MODULE="/Users/heartlesssoy/statistics/android/app"
#蒲公英API账号

PGYER_API_KEY="7b068367acb8249df56963d00a47df40"
PGYER_USER_KEY="e8726fd7da317988530522b5726b8542"
#APK路径
APK_PATH="${MAIN_MODULE}/build/outputs/apk/release"
echo "current path: `pwd`"
#遍历apk，选出今天生成的apk，有多个的话，选出第一个
TODAY=`date +%Y-%m-%d`
echo "Today is $TODAY"
for APK_FILE in ${APK_PATH}/*; do
    APK_NAME=`basename $APK_FILE`
    echo "$APK_NAME"
    if [[ "$APK_NAME" == "app-release.apk" ]];then
        echo "Upload apk:$APK_NAME"
        break
    fi
done
#curl上传至蒲公英，默认直接发布，不发布到广场
curl -F "file=@${APK_PATH}/${APK_NAME}" -F "buildInstallType=2" -F "buildPassword=123456" -F "_api_key=${PGYER_API_KEY}" https://www.pgyer.com/apiv2/app/upload










