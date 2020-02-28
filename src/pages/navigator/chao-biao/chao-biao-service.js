import api from '../../../utils/api';


export default {
    lists(pageIndex) {
        return api.postData('/api/MobileMethod/MGetMeterReadTempPageList', {pageIndex, pageSize: 10});
    },
    readMeter(keyValue, lastRead, nowRead) {
        return api.postData('/api/MobileMethod/MReadMeter', {keyValue, lastRead, nowRead});
    },
    lastMeter(keyValue) {
        return api.getData('/api/MobileMethod/MGetLastMeterReading', {keyValue});
    },
    saveMeter(readMonth) {
        return api.postData('/api/MobileMethod/MSaveReadMeter', {readMonth});
    },

};
