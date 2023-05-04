import api from '../../../utils/api';

export default {
    //固定资产详情
    gdzcBaseInfo(keyvalue) {
        return api.getData('/api/MobileMethod/MGetAssetsInfo', { keyvalue });
    },
    //领用记录列表
    gdzcAssetsUseInfo(pageIndex, assetsId) {
        return api.postData('/api/MobileMethod/MGetAssetsUsePageListJson', {
            pageIndex, pageSize: 10,
            queryJson: { assetsId: assetsId }
        });
    },
    //获取附件
    gdzcAssetsFileInfo(keyvalue) {
        return api.getData('/api/MobileMethod/MGetAssetsFilesData', { keyvalue });
    },
    //固定资产维修列表
    gdzcRepairList(pageIndex, assetsId) {
        return api.postData('/api/MobileMethod/MGetAssetsRepairPageListJson', {
            pageIndex, pageSize: 10,
            queryJson: { assetsId: assetsId }
        });
    },
    //盘点记录
    gdzcAssetsCheckList(pageIndex, assetsId) {
        return api.postData('/api/MobileMethod/MGetAssetsCheckPageListJson',
            {
                pageIndex, pageSize: 10,
                queryJson: { assetsId: assetsId }
            });
    },
    //资产盘点
    gdzcAssetsCheck(keyvalue, status, memo) {
        return api.postData('/api/MobileMethod/MAssetsCheck', { keyvalue, status, memo });
    },
};
