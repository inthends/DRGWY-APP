import api from '../../../utils/api';

export default {
    //工作台列表
    getOrderDatas(type, pageIndex) {
        let url = '/api/MobileMethod/MGetOrderPageListJson';
        return api.postData(url, { status: type , pageIndex, pageSize: 100});
    },
    getOrderDetail( orderId) {
        let url = '/api/MobileMethod/GetOrderEntity';
        return api.getData(url, { keyvalue: orderId});
    },
    getOrderCommunicates( orderId) {//获服务单沟通留言记录
        let url = '/api/Order/GetCommunicates';
        return api.getData(url, { keyvalue: orderId});
    },
    getReadForm( orderId) {//已阅
        let url = '/api/MobileMethod/ReadForm';
        return api.postData(url, { keyvalue: orderId});
    },
    getReplyCommunicate( orderId, contentMsg) {//回复
        let url = '/api/MobileMethod/ReplyCommunicate';
        return api.postData(url, { keyvalue: orderId,content:contentMsg});
    },
    getCloseOrder( orderId,contentMsg) {//闭单
        let url = '/api/MobileMethod/CloseOrder';
        return api.postData(url, { keyvalue: orderId, content:contentMsg});
    },
};
