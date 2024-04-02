import axios from 'axios';
import UDToast from './UDToast';
import qs from 'qs';
import ManualAction from './store/actions/manual-action';

export default {
    network(request) {
        // axios.defaults.withCredentials = true;
        const { url, params, method, showLoading, showError } = request;
        let showLoadingNumber;
        if (showLoading) {
            showLoadingNumber = UDToast.showLoading();
        }
        return new Promise((resolve, reject) => {
            const headers = {
                'Content-Type': 'application/x-www-form-urlencoded',
            };
            axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded';
            axios.defaults.headers['Authorization'] = 'Bearer ' + ManualAction.getTokenBYStore();
            // axios.defaults.headers['Authorization'] = 'Bearer ' + ''
            if (url.includes('/api/Mobile/GetServerUrl') || url.includes('/api/Mobile/GetVersion')) {
                axios.defaults.baseURL = 'http://hf.jslesoft.com:8008';
            } else {
                axios.defaults.baseURL = ManualAction.getUrl();
            } 
            // if (Object.keys(params).length > 0) { 
            // } 
            if (method === 'GET') {
                axios.get(url, { params, headers }).then(res => {
                    UDToast.hiddenLoading(showLoadingNumber);
                    this.success(showError, res, resolve, reject);
                }).catch(error => {
                    UDToast.hiddenLoading(showLoadingNumber);
                    this.fail(showError, error, reject);
                });
            } else {
                // let a = url + '?' + qs.stringify(params);
                let a = url;
                axios.post(a, qs.stringify(params)).then(res => {
                    UDToast.hiddenLoading(showLoadingNumber);
                    this.success(showError, res, resolve, reject);
                }).catch(error => {
                    UDToast.hiddenLoading(showLoadingNumber);
                    this.fail(showError, error, reject);
                });
            } 
        });
    },
    success(showError, res, resolve, reject) {
        const data = res.data;
        if (data.code !== 200) {
            data.msg.length > 0 && UDToast.showError(data.msg);
            reject(data);
        } else {
            resolve(data.data);
        }
    },
    fail(showError, error, reject) {
        if (error) {
            let errorStr = JSON.stringify(error);
            if (errorStr.includes('401')) {
                UDToast.showError('用户信息过期');
                ManualAction.saveTokenByStore(null);
            } else {
                if (showError && errorStr.length > 0) {
                    UDToast.showError(errorStr);
                }
                reject(error);
            }
        } else {
            reject(error);
        } 
    }, 
    getData(url, params = {}, showLoading = true, showError = true) {
        return this.network({
            url: url,
            params: params,
            showLoading: showLoading,
            method: 'GET',
            showError,
        });
    },
    postData(url, params = {}, showLoading = true, showError = true) {
        return this.network({
            url: url,
            params: params,
            showLoading: showLoading,
            method: 'POST',
            showError
        });
    },
    uploadFile(uri, id, type,
        uploadUrl, isPicture = true) {
        return new Promise(resolve => {
            const formData = new FormData();//如果需要上传多张图片,需要遍历数组,把图片的路径数组放入formData中
            const name = isPicture ? 'picture.png' : 'file.aac';
            let file = { uri: uri, type: 'multipart/form-data', name: name };   //这里的key(uri和type和name)不能改变, 
            formData.append('Files', file);   //这里的files就是后台需要的key
            formData.append('keyvalue', id);
            formData.append('type', type);
            axios.defaults.headers['Content-Type'] = 'multipart/form-data';
            axios.defaults.headers['Authorization'] = 'Bearer ' + ManualAction.getTokenBYStore();
            let showLoadingNumber = UDToast.showLoading('正在上传...');
            axios.post(uploadUrl, formData).then(res => {
                UDToast.hiddenLoading(showLoadingNumber);
                const data = res.data;
                if (data.code !== 200) {
                    UDToast.showError(data.msg);
                    reject(null);
                } else {
                    UDToast.showError('上传成功');
                    resolve(data.data.url);
                }
            }).catch(error => {
                resolve(null);
                UDToast.hiddenLoading(showLoadingNumber);
                UDToast.showError('上传失败，请稍后重试');
            });
        });
    },
};
