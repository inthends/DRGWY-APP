import api from '../../../utils/api';

export default {
    persons(showLoading = true) {
        return api.getData('/api/MobileMethod/MGetPollingUserList', showLoading);
    },

    xunjianData(userId, showLoading = true) {
        return api.postData('/api/MobileMethod/MGetPollingStatistics', {userId}, showLoading);
    },


    xunjianTaskList(status, userId) {
        return api.postData('/api/MobileMethod/MGetPollingTaskPageList', {
            pageIndex: 1,
            pageSize: 1000000,
            status,
            userId,
        });
    },
    xunjianDetail(taskId) {
        return api.getData('/api/MobileMethod/MGetPollingTaskEntity', {taskId});
    },
    xunjianDetailExtraData(taskId) {
        return api.getData('/api/MobileMethod/MGetPollingTaskFilesData', {taskId});
    },
    xunjianTaskDeletePhoto(taskId) {
        if (taskId && taskId.length > 0) {
            return api.postData('/api/MobileMethod/MDeleteTaskFiles', {taskId});
        } else {
            Promise.resolve();
        }
    },
    xunjianPointDetail(lineId, pointId) {
        return api.getData('/api/MobileMethod/MGetPollingPointEntity', {lineId, pointId});
    },

    xunjianExecute(keyvalue, userId, userName,inspectData, showLoading = true) {
        return api.postData('/api/MobileMethod/MExcutePollingTasck', {
            keyvalue,
            userId,
            userName,
            inspectData
        }, showLoading);
    },
    xunjianAddress(pointId) {
        return api.getData('/api/MobileMethod/MGetPollingPointDetail', {pointId});
    },
    xunjianIndexList(userId) {
        return api.postData('/api/MobileMethod/MGetPollingLinePageList', {pageIndex: 1, pageSize: 100, userId});
    },
    xunjianIndexDetail(lineId) {
        return api.getData('/api/MobileMethod/MGetPollingTaskPoints', {lineId});
    },


    //有网络
    xunjianPointTasks(pointId, showLoading = true) {
        return api.getData('/api/MobileMethod/MGetPollingPointTasks', {pointId}, showLoading);
    },

    //无网络
    MGetPollingUserPointTasks() {
        return api.getData('/api/MobileMethod/MGetPollingUserPointTasks', {}, false);
    },


};
