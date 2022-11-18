import { Platform, Linking, Alert } from 'react-native';
import forge from 'node-forge';
import UDToast from './UDToast';

export default {
    convertObjectToArray(object) {
        if (!object) {
            return [];
        }
        var item = [];
        Object.keys(object).forEach(key => {
            item.push(object[key]);
        });
        return item;
    },
    convertArrayToObject(array, key) {
        console.log('array', array);

        if (!array) {
            return {};
        }
        var obj = {};
        array.forEach(item => {
            const itemKey = item[key];
            obj[itemKey] = item;
        });
        return obj;
    },
    getNumberOfObject(object) {
        if (!object) {
            return 0;
        }
        return this.convertObjectToArray(object).filter(item => item.check).map(item => {
            let quantity = item.quantity;
            if (!quantity) {
                quantity = 0;
            }
            return parseInt(item.quantity);

        }).reduce((a, b) => a + b, 0);
    },
    getAllPrice(object) {
        if (!object) {
            return 0;
        }
        return this.convertObjectToArray(object).filter(item => item.check).reduce((a, item) => a + item.price * item.quantity, 0.0).toFixed(2);
    },
    getPercent(fenzi, fenmu) {
        if (!fenzi || !fenmu) {
            return 0;
        }
        let zi = parseFloat(fenzi);
        let mu = parseFloat(fenmu);
        if (isNaN(zi) || isNaN(mu)) {
            return 0;
        }
        if (mu < 0.00001) {
            return 0;
        }
        return (zi / mu * 100).toFixed(2);
    },
    getCurrentUrlParams() {
        return this.urlSearch(decodeURI(window.location.href));
    },
    urlSearch(str) {
        let name, value;
        let num = str.indexOf('?');
        str = str.substr(num + 1); //取得所有参数   stringvar.substr(start [, length ]
        let arr = str.split('&'); //各个参数放到数组里
        console.log(arr);
        let params = {};
        for (let i = 0; i < arr.length; i++) {
            num = arr[i].indexOf('=');
            if (num > 0) {
                name = arr[i].substring(0, num);
                value = arr[i].substr(num + 1);
                params[name] = value;
            }
        }
        return params;
    },
    homeNeedReload() {
        if (sessionStorage.getItem('homeNeedReload') === '1') {
            return false;
        } else {
            sessionStorage.setItem('homeNeedReload', '1');
            return true;
        }
    },
    isIOS() {
        return Platform.OS === 'ios';
    },
    filtEmoji(str) {
        var ranges = [
            '\ud83c[\udf00-\udfff]',
            '\ud83d[\udc00-\ude4f]',
            '\ud83d[\ude80-\udeff]',
        ];
        return str.replace(new RegExp(ranges.join('|'), 'g'), '');
    },
    getValueFromProps(props, key) {
        let new_kwey = key;
        if (!new_kwey) {
            new_kwey = 'data';
        }
        return props.navigation.getParam(new_kwey);
    },
    convertArrayToSmallArray(array) {
        let bb = [];
        let aa = [...array];
        while (aa.length > 5) {
            bb.push(aa.splice(0, 5));
        }
        if (aa.length > 0) {
            bb.push(aa);
        }
        return bb;
    },
    getGuid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    },

    jiami(psd) {
        let md = forge.md.md5.create();
        md.update(psd);
        let password = md.digest().toHex();
        return password;
    },
    pagebackAfterTime(props, timeout = 2000) {
        setTimeout(() => {
            props.navigation.goBack();
        }, timeout);
    },
    call(phone) {
        if (!phone) {
            UDToast.showInfo('手机号不能为空');
            return;
        }
        const url = `tel:${phone}`;
        Linking.canOpenURL(url)
            .then(supported => {
                if (!supported) {
                    return Alert.alert('提示', `您的设备不支持该功能，请手动拨打 ${phone}`, [
                        { text: '确定' },
                    ]);
                }
                return Linking.openURL(url);
            })
            .catch(err => UDToast.showInfo(err));

    },
    getYM(ym) {
        return this.getYearAndMonth(ym || '2019-01', this.getCurrentYearAndMonth()).reverse();
    },
    getCurrentYearAndMonth() {
        let date = new Date();
        let m = date.getMonth();
        m += 1;
        if (m < 10) {
            m = '0' + m;
        }
        return date.getFullYear() + '-' + m;
    },
    getYearAndMonth(start, end) {
        var result = [];
        var starts = start.split('-');
        var ends = end.split('-');
        var staYear = parseInt(starts[0]);
        var staMon = parseInt(starts[1]);

        var endYear = parseInt(ends[0]);
        var endMon = parseInt(ends[1]);
        result.push(staYear + '-' + starts[1]);
        while (staYear <= endYear) {
            if (staYear === endYear) {
                while (staMon < endMon) {
                    staMon++;
                    if ((staMon + '').length === 1) {
                        staMon = '0' + staMon;
                    }
                    result.push(staYear + '-' + staMon);
                }
                staYear++;
            } else {
                staMon++;
                if (staMon > 12) {
                    staMon = 1;
                    staYear++;
                }
                if ((staMon + '').length === 1) {
                    staMon = '0' + staMon;
                }
                result.push(staYear + '-' + staMon);
            }
        }
        return result;
    },
    handleNetList(state, dataInfo) {
        let d = dataInfo;
        let pageIndex = 1;
        if (dataInfo.pageIndex > 1) {
            d = {
                ...dataInfo,
                data: [...state.dataInfo.data, ...dataInfo.data],
            };
            pageIndex = dataInfo.pageIndex;
        }
        return {
            dataInfo: d,
            pageIndex,
        };

    },
    //此方法已废弃
    // getServiceStatus(i) {
    //     let index = parseInt(i);
    //     if (isNaN(index) || index < -1 || index > 4) {
    //         return '';
    //     }
    //     return ['', '待处理', '待完成', '待回访', '待检验', '已回访', '已检验', '已归档'][index];
    // },
    getMonthFirstDay(ym) { 
        let a = ym.split('-');
        let year = a[0];
        let month = parseInt(a[1]);
        if (month < 10) {
            month = '0' + month;
        }
        return year + '-' + month + '-01 00:00:00';
    },
    getMonthLastDay(ym) {
        let a = ym.split('-');
        let year = parseInt(a[0]);
        let month = parseInt(a[1]);
        var new_year = year;    //取当前的年份
        var new_month = month++;//取下一个月的第一天，方便计算（最后一天不固定）
        if (month > 12) {
            new_month -= 12;        //月份减
            new_year++;            //年份增
        }
        var new_date = new Date(new_year, new_month, 1);                //取当年当月中的第一天
        new_date = new Date(new_date.getTime() - 1000 * 60 * 60 * 24);
        // return ();//获取当月最后一天日期

        let y = new_date.getFullYear();
        let m = new_date.getMonth();
        m += 1;
        if (m < 10) {
            m = '0' + m;
        }
        let d = new_date.getDate();
        return y + '-' + m + '-' + d + ' 23:59:59';

        // console.log('month',month)
        // month += 1;
        // console.log('mont2',month)
        // if(month > 12) {
        //     month = 1       //月份减
        //     year += 1;            //年份增
        // }
        // var new_date = new Date(year,month,1);                //取当年当月中的第一天
        // console.log('new_date',new_date);
        // let aaa = new Date(new_date.getTime()-1000);
        // console.log(aaa);
        // return 1
        // return aaa.getFullYear() + '-' + aaa.getMonth();
        // return (new Date(new_date.getTime()-1000*60*60*24)).getDate();//获取当月最后一天日期
    },
    objToFormdata(data) {
        let formData = new FormData();
        for (let k in data) {
            let value = data[k] !== undefined ? data[k] : '';
            if (typeof (value) === 'Object') {
                formData.append(k, JSON.stringify(value));
            } else {
                formData.append(k, value);
            }
        }
        return formData;
    },
    handlerVersionString(version) {
        let versions = version.split('.');
        let number = 0;
        if (versions.length === 3) {
            number = parseInt(versions[0]) * 10000 + parseInt(versions[1]) * 100 + parseInt(versions[2]);
        } else {
            number = parseInt(versions[0]) * 10000 + parseInt(versions[1]) * 100;
        }
        return number;
    },
    appId() {
        return '';
    },


};
