import api from '../../utils/api';

export default {
    workData() {
        return api.postData('/api/MobileMethod/MGetDeskStatistics');
    },

    //房产类别，1获取小区，获取小区时候keyvalue=0，2获取楼栋，4获取楼层，5获取房间
    getPStructs(params) {
        return api.getData('/api/MobileMethod/MGetPStructs', params);
    },
    saveForm(params) {
        return api.postData('/api/MobileMethod/MSaveServiceDeskForm', params);
    },
    //服务单详情
    serviceDetail(type, keyValue) {
        let url = '/api/MobileMethod/MGetServicedeskEntity';
        return api.getData(url, {keyValue});
        // if (type === '报修') {
        //     url = '/api/MobileMethod/MGetRepairEntity';
        // } else if (type === '投诉') {
        //     url = '/api/MobileMethod/MGetComplaintEntity';
        // }
    },
    //服务单操作
    serviceHandle(handle, keyValue, content, extra = null) {
        let url = '';
        let params = {keyValue, content};
        if (extra) {
            params = {
                ...params,
                ...extra,
            };
        }
        if (handle === '回复') {
            url = '/api/MobileMethod/MSendCommunicate';
        } else if (handle === '转投诉') {
            url = '/api/MobileMethod/MChangeToComplaint';
        } else if (handle === '转维修') {
            url = '/api/MobileMethod/MChangeToRepair';
        } else if (handle === '关闭') {
            url = '/api/MobileMethod/MFinish';
        } else if (handle === '派单') {
            url = '/api/MobileMethod/MRepairDispatch';
        } else if (handle === '接单') {
            url = '/api/MobileMethod/MRepairAccept';
        } else if (handle === '开始维修') {
            url = '/api/MobileMethod/MRepairStart';
        } else if (handle === '完成维修') {
            url = '/api/MobileMethod/MRepairHandleFinish';
        } else if (handle === '完成回访') {
            url = '/api/MobileMethod/MRepairVisitFinish';
        } else if (handle === '完成检验') {
            url = 'MRepairCheckFinish';
        }

        return api.postData(url, params);
    },
    //服务单附件
    serviceExtra(keyValue) {
        return api.getData('/api/MobileMethod/MGetFilesData', {keyValue});
    },
    serviceCommunicates(keyValue) {
        return api.getData('/api/MobileMethod/MGetCommunicates', {keyValue, pageIndex: 1, pageSize: 100});
    },
    //维修单详情
    weixiuDetail(keyValue) {
        return api.getData('/api/MobileMethod/MGetRepairEntity', {keyValue});
    },
    //投诉单详情
    tousuDetail(keyValue) {
        return api.getData('/api/MobileMethod/MGetComplaintEntity', {keyValue});
    },

    //工作台列表
    workList(type, overdue, pageIndex) {
        let url = '/api/MobileMethod/MGetRepairPageList';
        if (type === '3') {
            url = '/api/MobileMethod/MGetUnFinishRepairPageList';
        } else if (type === '6') {
            url = '/api/MobileMethod/MGetTestAndVisitRepairPageList';
            type = overdue;
            overdue = null;
        } else if (type === 'fuwu') {
            url = '/api/MobileMethod/MGetUnReplyServiceDeskPageList';
            type = null;
        }

        return api.postData(url, {status: type, pageIndex, pageSize: 100, overdue,isOverdue:overdue});
    },

};
