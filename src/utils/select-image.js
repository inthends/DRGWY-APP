import ImagePicker from 'react-native-image-picker';
import UDToast from './UDToast';
import api from './api';
import {ImagePickerOptions} from 'react-native-image-picker/src/internal/types';

const options: ImagePickerOptions = {
    title: '请选择',
    cancelButtonTitle: '取消',
    takePhotoButtonTitle: '相机',
    chooseFromLibraryButtonTitle: '相册',
    storageOptions: {
        skipBackup: true,
        path: 'images',
    },
    permissionDenied: {
        title: '暂无权限',
        text:
            '请在系统设置中打开拍照或选择图片的权限',
        reTryTitle: '重试',
        okTitle: '取消',
    },
};


export default class SelectImage {
    static select(id, uploadUrl, hasNetwork = true) {
        return new Promise((resolve, reject) => {
            ImagePicker.showImagePicker(options, (response) => {
                // console.log('Response = ', response);
                if (response.didCancel) {
                    // UDToast.showInfo('已取消选择图片');
                } else if (response.error) {
                    UDToast.showInfo('没有权限，请在设置中开启权限');
                } else {
                    // console.log('response', response);
                    // let formData = new FormData();//如果需要上传多张图片,需要遍历数组,把图片的路径数组放入formData中
                    // let file = {uri: response.uri, type: 'multipart/form-data', name: 'image.png'};   //这里的key(uri和type和name)不能改变,
                    // formData.append("files",file);   //这里的files就是后台需要的key

                    // You can also display the image using data:
                    // const source = { uri: 'data:image/jpeg;base64,' + response.data };
                    if (hasNetwork) {
                        api.uploadFile(response.uri, id, uploadUrl).then(res => {
                            if (!!res){
                                resolve(res);
                            }
                        }).catch(error => {

                        });
                    } else {
                        resolve({
                            uri: 'data:image/jpeg;base64,' + response.data,
                            fileUri: response.uri,
                        });
                    }


                }
            });
        });
    }
}
