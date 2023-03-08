import api from '../../../utils/api';


export default {
    lists(pageIndex) {
        return api.postData('/api/MobileMethod/MGetMeterReadTempPageList', {pageIndex, pageSize: 10});
    },
    readMeter(keyvalue, lastRead, nowRead) {
        return api.postData('/api/MobileMethod/MReadMeter', {keyvalue, lastRead, nowRead});
    },
    lastMeter(keyvalue) {
        return api.getData('/api/MobileMethod/MGetLastMeterReading', {keyvalue});
    },
    saveMeter(readMonth) {
        return api.postData('/api/MobileMethod/MSaveReadMeter', {readMonth});
    },

};
