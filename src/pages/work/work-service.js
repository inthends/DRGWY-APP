import api from '../../utils/api';

export default {

    //检查单详情
    checkDetail(keyvalue) {
        return api.getData('/api/MobileMethod/MGetCheckEntity', { keyvalue });
    },

    //检查单明细
    checkDetailList(
        pageIndex,
        billId
    ) {
        return api.postData('/api/MobileMethod/MGetCheckDetailPageList', {
            pageIndex,
            pageSize: 10,
            billId
        });
    },

    saveCheck(
        billId,
        mainMemo) {
        return api.postData('/api/MobileMethod/MSaveCheck', {
            billId,
            mainMemo
        });
    },

    addCheckDetail(
        billId,
        mainMemo,
        detailId,
        unitId,
        allName,
        dutyUserId,
        dutyUserName,
        checkMemo) {
        return api.postData('/api/MobileMethod/MAddCheckDetail', {
            billId,
            mainMemo,
            detailId,
            unitId,
            allName,
            dutyUserId,
            dutyUserName,
            checkMemo
        });
    },
 
    workData(showLoading) {
        return api.postData('/api/MobileMethod/MGetDeskStatistics', showLoading);
    },
    //房产类别，1获取小区，获取小区时候keyvalue=0，2获取楼栋，4获取楼层，5获取房间
    getPStructs(params) {
        return api.getData('/api/MobileMethod/MGetPStructs', params);
    },
    saveForm(params, showLoading = true) {
        return api.postData('/api/MobileMethod/MSaveServiceDeskForm', params, showLoading);
    },
    serviceDetail(keyvalue) {
        return api.getData('/api/MobileMethod/MGetServicedeskEntity', { keyvalue });
    },
    //服务单附件
    serviceExtra(keyvalue) {
        return api.getData('/api/MobileMethod/MGetFilesData', { keyvalue });
    },

    //附件
    checkFiles(keyvalue) {
        return api.getData('/api/MobileMethod/MGetCheckFilesData', { keyvalue });
    },

    //服务单操作
    serviceHandle(handle, keyvalue, content, extra = null) {
        let url = '';
        let params = { keyvalue, content };
        if (extra) {
            params = {
                ...params,
                ...extra
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
        }
        else if (handle === '退单') {
            url = '/api/MobileMethod/MRepairBack';
        }
        else if (handle === '完成维修') {
            url = '/api/MobileMethod/MRepairHandleFinish';
        } else if (handle === '完成回访') {
            // url = '/api/MobileMethod/MRepairVisitFinish';
            url = '/api/MobileMethod/MVisitFinish';//服务单完成回访
        } else if (handle === '完成检验') {
            url = '/api/MobileMethod/MRepairCheckFinish';
        }
        return api.postData(url, params);
    },

    //协助维修
    assistRepair(keyvalue, type) {
        let params = { keyvalue, type };
        return api.postData('/api/MobileMethod/MRepairHandleAssist', params);
    },

    serviceCommunicates(keyvalue) {
        return api.getData('/api/MobileMethod/MGetCommunicates', { keyvalue, pageIndex: 1, pageSize: 100 });
    },
    //维修单单据动态
    getOperationRecord(keyvalue) {
        return api.getData('/api/MobileMethod/MGetOperationRecordList', { keyvalue, pageIndex: 1, pageSize: 100 });
    },
    weixiuDetail(keyvalue) {
        return api.getData('/api/MobileMethod/MGetRepairEntity', { keyvalue });
    },
    //维修单附件
    weixiuExtra(keyvalue) {
        return api.getData('/api/MobileMethod/MGetRepairFilesData', { keyvalue });
    },
    //投诉单详情
    tousuDetail(keyvalue) {
        return api.getData('/api/MobileMethod/MGetComplaintEntity', { keyvalue });
    },
    //投诉单附件
    tousuExtra(keyvalue) {
        return api.getData('/api/MobileMethod/MGetComplaintFilesData', { keyvalue });
    },

    //工作台列表
    workList(type, overdue, pageIndex) {
        let url = '/api/MobileMethod/MGetRepairPageList';
        if (type === '3') {
            //待完成的维修单
            url = '/api/MobileMethod/MGetUnFinishRepairPageList';
        }
        else if (type === '6') {
            //待检验的维修单
            url = '/api/MobileMethod/MGetTestRepairPageList';
            type = overdue;
            overdue = null;
        }
        else if (type === 'fuwu') {
            if (overdue === -1) {
                //已回复，已经回复不判断是否逾期
                url = '/api/MobileMethod/MGetReplyServiceDeskPageList';
                type = null;
            } else {
                //待回复
                url = '/api/MobileMethod/MGetUnReplyServiceDeskPageList';
                type = null;
            }
        }
        else if (type === 'visit') {
            //待回访的服务单
            url = '/api/MobileMethod/MGetUnVisitServiceDeskPageList';
            type = null;
        }

        else if (type === 'assist') {
            //待协助列表
            url = '/api/MobileMethod/MGetAssistRepairPageList';
        }

        return api.postData(url, { status: type, isOverdue: overdue, pageIndex, pageSize: 100 });
    },


    //获取人员
    // getWorkers(organizeId, keyword = null, type = '员工') {
    //     return api.getData('/api/MobileMethod/MGetUserList', { organizeId, keyword, type });
    // },


    paidan(keyvalue, receiverName, receiverId) {
        return api.postData('/api/MobileMethod/MRepairDispatch', { keyvalue, receiverName, receiverId });
    },
    unreadCount() {
        return api.getData('/api/MobileMethod/MGetUnReadNewsCount', {}, false);
    },
    unreadList(pageIndex, showLoading) {
        return api.postData('/api/MobileMethod/MGetNewsPageList', { pageIndex, pageSize: 10 }, showLoading);
    },
    readNews(newsId) {
        return api.postData('/api/MobileMethod/MReadNews', { newsId });
    },
};
