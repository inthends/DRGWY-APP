import ImagePicker from 'react-native-image-picker';
import UDToast from './UDToast';
import api from './api';
import { ImagePickerOptions } from 'react-native-image-picker/src/internal/types';

const options: ImagePickerOptions = {
    title: '请选择',
    cancelButtonTitle: '取消',
    takePhotoButtonTitle: '相机',
    //设置照片最大尺寸，压缩照片，减少上传时间
    maxWidth: 1000,
    maxWidth: 1000,
    quality: 0.5,//0到1，低质量，减少网络传输时间
    storageOptions: {
        skipBackup: true,
        path: 'images'
    },
    permissionDenied: {
        title: '暂无权限',
        text: '请在系统设置中打开拍照或选择图片的权限',
        reTryTitle: '重试',
        okTitle: '取消'
    },
    mediaType: 'photo'
};

//选择巡检图片，打开就直接启动相机
export default class SelectPollingImage {
    static select(id, type, uploadUrl, hasNetwork = true) {
        if (uploadUrl == '/api/MobileMethod/MUploadPollingTask') {
            //如果是巡检，则禁止选择相册，防止作弊 2023-10-30
            options.chooseFromLibraryButtonTitle = '';//标题为空，就不显示按钮了
        } else {
            options.chooseFromLibraryButtonTitle = '相册';//还原
        }


        return new Promise((resolve, reject) => { 
            //打开直接拍照
            ImagePicker.launchCamera(options, (response) => {
                if (response.didCancel) {
                    //console.log('用户取消了拍照');
                } else if (response.error) {
                    //console.log('拍照错误：', response.error);
                    UDToast.showError('没有权限，请在设置中开启权限');
                } else {

                    //response.uri 是图片的本地文件路径
                    //console.log('图片路径：', response.uri);
                    //在这里处理图片，比如上传到服务器或者保存到状态

                    if (hasNetwork) {
                        api.uploadFile(response.uri, id, type, uploadUrl).then(res => {
                            if (!!res) {
                                resolve(res);
                            }
                        }).catch(error => { });
                    } else {
                        //没有网络，暂存
                        resolve({
                            uri: 'data:image/jpeg;base64,' + response.data,
                            fileUri: response.uri
                        });
                    }
                }
            });
 
        });
    }
}
