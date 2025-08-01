import api from '../../../utils/api';

export default {
    persons(showLoading = true) {
        return api.getData('/api/MobileMethod/MGetPollingUserList', showLoading);
    },

    xunjianData(userId, showLoading = true) {
        return api.postData('/api/MobileMethod/MGetPollingStatistics', { userId }, showLoading);
    },
 
    //判断巡检点位状态
    checkPollingState(pointId,lineId) {
        return api.getData('/api/MobileMethod/MCheckPollingState', { pointId,lineId });
    },

    xunjianTaskList(status, userId) {
        return api.postData('/api/MobileMethod/MGetPollingTaskPageList', {
            pageIndex: 1,
            pageSize: 10000,
            status,
            userId
        });
    },
    xunjianDetail(taskId) {
        return api.getData('/api/MobileMethod/MGetPollingTaskEntity', { taskId });
    },
    xunjianDetailExtraData(taskId) {
        return api.getData('/api/MobileMethod/MGetPollingTaskFilesData', { taskId });
    },
    xunjianTaskDeletePhoto(taskId) {
        if (taskId && taskId.length > 0) {
            return api.postData('/api/MobileMethod/MDeleteTaskFiles', { taskId });
        } else {
            Promise.resolve();
        }
    },
    xunjianPointDetail(lineId, pointId) {
        return api.getData('/api/MobileMethod/MGetPollingPointEntity', { lineId, pointId });
    },

    xunjianExecute(keyvalue, userId, userName, inspectData, showLoading = true) {
        return api.postData('/api/MobileMethod/MExcutePollingTasck', {
            keyvalue,
            userId,
            userName,
            inspectData
        }, showLoading);
    },

    xunjianAddress(pointId) {
        return api.getData('/api/MobileMethod/MGetPollingPointDetail', { pointId });
    },
    xunjianIndexList(userId) {
        return api.postData('/api/MobileMethod/MGetPollingLinePageList', { pageIndex: 1, pageSize: 100, userId });
    },
    xunjianIndexDetail(lineId) {
        return api.getData('/api/MobileMethod/MGetPollingTaskPoints', { lineId });
    },

    //获取巡检任务
    xunjianPointTasks(lineId,pointId, showLoading = true) {
        return api.getData('/api/MobileMethod/MGetPollingPointTasks', {lineId, pointId }, showLoading);
    },

    //离线巡检时候缓存数据，废弃，跟上面共用一个方法
    // MGetPollingUserPointTasks() {
    //     return api.getData('/api/MobileMethod/MGetPollingUserPointTasks', {}, false);
    // } 

    //附件
    deletePollingFile(url) {
        return api.getData('/api/MobileMethod/MDeletePollingFile', { url });
    }
};
