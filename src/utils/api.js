import axios from 'axios';
import UDToast from './UDToast';
import qs from 'qs';
import ManualAction from './store/actions/manual-action';

export default {
    network(request) {
        // axios.defaults.withCredentials = true;
        const {url, params, method, showLoading, showError} = request;
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
            // axios.defaults.headers['Authorization'] = 'Bearer ' + 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoic3lzdGVtIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy91c2VyZGF0YSI6IkE3QTU0OUVGNkI1QTNDNTU2RTA5MkU3NDlGNzBCMDIxNDBEMTY2OTg2NUNEODM1N0VFN0RBNkM0NjJDNUQxOTQ4REI1NkEwQkZGQkU4OTBGRTM1MzExNjg5QjYzQzE5MEU1MEMxMjIzM0Q4MjYzMjE1MTAxMTEzNkI0RDMyMjYzNkRGOTEzMzhDRUU4Mjg3NzZDMkFCOUEwODRFRkI1NjQxMzY2RjFGQ0Y3RDNFREM4NTg5MzQzQkQ2OEYxODRBMzY1ODI5NEM3QkVDRTYyNzIxMTM0QzFDRTVBREY0QjcwQzQ5OUU5N0Q1OTMwMEY2MzI5REJGNTBBNDIxQUJDNzg3RjFDOTY0MUJGMTRBMDM3QzZCNzlDNEVDREIxREUwOTJBQzgxRTA2RkJBNkY4Q0Y2RkVCNDM1OTI2QkUxMkE2QkE1OEJBOURCMjRBRTBGRTcwMDZFMUFDNDI5QTY4NzcyODU4ODMyNzY0MjUwMzNGOTBDRjc4NUZBNTRCNDlEQzE0QzBGMDAyNEIyRDFEOTJCNzMwQUJDMDQ5RDk1RDc2MDdDNDA1M0JFQjFFRTUwQjY0NTlFNEMwRUIxMURGN0Y1MTI4OTYyOEIyMzMyMjJCRkU3MjBFM0E3NTA3NUM1MEE4Rjk5RTI1RkUxRDg5RjJGMkVCQjY5OEY5Njk4MDlEQkJDQTk4RTA2MTI1RDJDQUFFMTBEOUQzMDVEMDNDQ0ZFMEM4RDkyMUY4NDZEN0YxNkRFQzRBRUU3RTNGNUVFNURGOTU5RDU4MUEyRTgwOEZERUNGMkZDREMxQkJFNUVDNUI1NDEyRTk2QUYwQjAxMzMwNUMzMTYwRDFCMTU1ODlCMjNFQUNEMDY0MEFFNzY1NDE3REJFNzRBREYyRDg2NDRFNzI5RjU4OUMyODRFNzJEMjVBQkE4NDVFNzIyQjQ1NkE5Q0Y1MjlDMEZBQUNBN0Q0QUFEMTUzMkQ3MUJGRDE2Q0RCRDc4MjFEMTFFRkQwN0Q0NTY1QzQ3QUY3QjYzMDM5NEM2MzRBNkJCMUU3OTE2QTgzNjBGOUEwNDYwMzc0QjY1Mzg2Nzk3MkNDM0M1MUU3Q0FCNTIyMzQzQzZDRTY2NTRDMUVFNjNENDRENUFBMzFBQTkwQTA4MjVBODYwOTE2NDY3NDAwRjQyMDhFMkI2NzRDMjMxMzFDQTc4QTI0RDJDMDAzMTNBRjU2OTc3REQ5M0RDM0JFODg3NjVBODIiLCJleHAiOjE1Njc3OTY5MTksImlzcyI6IkRSR1dZLlNlcnZlciIsImF1ZCI6IkRSR1dZLkFQUCJ9.fTiG8618-UDfRQVka2vpi7CQITmeL6tRjHbnHiVrQ8M'
            if (url.includes('/api/Mobile/GetServerUrl') || url.includes('/api/Mobile/GetVersion')) {
                axios.defaults.baseURL = 'http://hf.jslesoft.com:8008';
            } else {
                axios.defaults.baseURL = ManualAction.getUrl();
            }

            if (Object.keys(params).length > 0) {
                console.log('参数', params);
            }


            if (method === 'GET') {
                axios.get(url, {params, headers}).then(res => {
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
        // console.log(123, res);
        const data = res.data;
        if (data.code !== 200) {
            data.msg.length>0 && UDToast.showError(data.msg);
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
            showError,
        });
    },
    uploadFile(uri, id, uploadUrl, isPicture = true) {
        return new Promise(resolve => {
            const formData = new FormData();//如果需要上传多张图片,需要遍历数组,把图片的路径数组放入formData中
            const name = isPicture ? 'picture.png' : 'file.aac';
            let file = {uri: uri, type: 'multipart/form-data', name: name};   //这里的key(uri和type和name)不能改变,
            //console.log('file', file);
            formData.append('Files', file);   //这里的files就是后台需要的key
            formData.append('keyvalue', id);
            console.log('formData', formData);
            axios.defaults.headers['Content-Type'] = 'multipart/form-data';
            axios.defaults.headers['Authorization'] = 'Bearer ' + ManualAction.getTokenBYStore();
            let showLoadingNumber = UDToast.showLoading('正在上传...');
            axios.post(uploadUrl, formData).then(res => {
                console.log(1122,res)
                UDToast.hiddenLoading(showLoadingNumber);
                const data = res.data;
                // console.log(res);
                if (data.code !== 200) {
                    UDToast.showError(data.msg);
                    reject(null);
                } else {
                    UDToast.showError('上传成功');
                    resolve(data.data.url);
                }
            }).catch(error => {
                console.log(3344,error)
                resolve(null);
                UDToast.hiddenLoading(showLoadingNumber);
                UDToast.showError('上传失败，请稍后重试');
            });
        });
    },
};
