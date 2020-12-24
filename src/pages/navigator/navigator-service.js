
import api from '../../utils/api';
//import common from '../../utils/common';

export default {
    getFeeStatistics(pageIndex, OrganizeId, pageSize = 10) {
        return api.postData('/api/MobileMethod/MGetFeeStatistics', { pageIndex, pageSize, OrganizeId });
    },
    //楼栋或者车库
    getBuildings(keyValue) {
        // return api.getData('/api/MobileMethod/MGetPStructs', {keyValue, type: 2});
        return api.getData('/api/MobileMethod/MGetFeePStructs', { keyValue, type: 2 });
    },
    //楼层
    getFloors(keyValue) {
        return api.getData('/api/MobileMethod/MGetFeePStructs', { keyValue, type: 4 });
    },
    //车位
    getParkings(keyValue) {
        return api.getData('/api/MobileMethod/MGetFeePStructs', { keyValue, type: 9 });
    },
    //房间
    getRooms(keyValue) {
        return api.getData('/api/MobileMethod/MGetFeePStructs', { keyValue, type: 5 });
    },

    //账单
    getBillList(type, id, isShow, pageIndex, pageSize = 10) {
        let url = '/api/MobileMethod/MGetNotChargeBillList';
        if (type === '已收') {
            url = '/api/MobileMethod/MGetChargeBillList';
        }
        return api.postData(url, { pageIndex, pageSize, unitId: id, isShow: isShow });
    },
    //服务单
    serviceList(pageIndex, billStatus, treeType, organizeId, billType, startTime, endTime) {
        /*
        {:,TreeType:,organizeId:BillType:,StartTime:,EndTime:,}
         */

        // if (billType === '报修') {
        //     url = '/api/MobileMethod/MGetRepairPageList';
        // } else if (billType === '投诉') {
        //     url = '/api/MobileMethod/MGetComplaintPageList';
        // }

        return api.postData('/api/MobileMethod/MGetServiceDeskPageList', {
            pageIndex,
            pageSize: 10,
            billStatus,
            status: billStatus,
            //treeType,
            organizeId,
            billType,
            startTime,
            endTime,
        });
    },

    weixiuList(pageIndex, billStatus, treeType, organizeId, startTime, endTime, repairArea) {
        /*
        {:,TreeType:,organizeId:BillType:,StartTime:,EndTime:,}
         */

        // if (billType === '报修') {
        //     url = '';
        // } else if (billType === '投诉') {
        //     url = '/api/MobileMethod/MGetComplaintPageList';
        // }

        return api.postData('/api/MobileMethod/MGetRepairPageListForNavigator', {
            pageIndex,
            pageSize: 10,
            //billStatus,
            status: billStatus,
            //treeType,
            organizeId,
            startTime,
            endTime,
            repairArea
        });
    },

    tousuList(pageIndex, billStatus, treeType, organizeId, billType, startTime, endTime) {
        return api.postData('/api/MobileMethod/MGetComplaintPageList', {
            pageIndex,
            pageSize: 10,
            //billStatus,
            status: billStatus,
            //treeType,
            organizeId,
            billType,
            startTime,
            endTime
        });
    },
    //服务单详情
    // serviceDetail(type,keyValue) {
    //     let url = '/api/MobileMethod/MGetServicedeskEntity';
    //     if (billType === '报修') {
    //         url = '/api/MobileMethod/MGetRepairEntity';
    //     } else if (billType === '投诉') {
    //         url = '/api/MobileMethod/MGetComplaintEntity';
    //     }
    //     return api.getData(url,{keyValue});
    // }

    collectionRate(page, estateId, type) {
        let url;
        switch (page) {
            case 1: {
                url = '/api/MobileMethod/MGetCollectionRate';
                break;
            }
            case 2: {
                url = '/api/MobileMethod/MGetCashFlow';
                break;
            }
            case 3: {
                url = '/api/MobileMethod/MGetArrearsAge';
                break;
            }
            case 4: {
                url = '/api/MobileMethod/MGetRepairCompletionRate';
                break;
            }
            case 5: {
                url = '/api/MobileMethod/MGetComplaintCompletionRate';
                break;
            }
            case 6: {
                url = '/api/MobileMethod/MGetVisitSatisfactionRate';
                break;
            }
            default:
                break;
        }
        return api.postData(url, { estateId, type });
    },
    // createOrder(linkId) {
    //     return api.postData('/api/MobileMethod/MCreateTradeno', {linkId});
    // },

    //创建预订单号
    createOrder(linkId, isML, mlType, mlScale) {
        return api.postData('/api/MobileMethod/MCreateTradeno', { linkId, isML, mlType, mlScale });
    },

    scanPay(auth_code, tbout_trade_no) {
        return api.postData('/api/MobileMethod/WFTScanPay', { auth_code, tbout_trade_no });
    },
    scanPayQuery(tbout_trade_no) {
        return api.postData('/api/MobileMethod/WFTScanPayQuery', { tbout_trade_no }, false);
    },
    scanPayReserve(tbout_trade_no) {
        return api.postData('/api/MobileMethod/WFTScanPayReserve', { tbout_trade_no }, false);
    },
    qrcodePay(tbout_trade_no) {
        return api.postData('/api/MobileMethod/WFTPay', { tbout_trade_no });
    },

    //现金收款
    cashPay(linkId, isML, mlType, mlScale) {
        return api.postData('/api/MobileMethod/MCharge', { linkId, isML, mlType, mlScale });
    },

    cashPayPrint(linkId) {
        return api.postData('/api/MobileMethod/MGetCashPrintInfo', { linkId });
    },
    orderStatus(out_trade_no) {
        return api.postData('/api/MobileMethod/WFTPayResult', { out_trade_no }, false);
    },

    printInfo(out_trade_no) {
        return api.getData('/api/MobileMethod/MGetPrintInfo', { out_trade_no });
    },
    RePrintInfo(billId) {
        return api.getData('/api/MobileMethod/MGetRePrintInfo', { billId });
    },

    getFeeItemTreeJson(unitId) {
        return api.getData('/api/MobileMethod/GetFeeItemTreeJson', { unitId });
    },
    getFeeItemDetail(unitId, feeItemId) {
        return api.getData('/api/MobileMethod/GetFeeItemDetail', { unitId, feeItemId });
    },
    saveFee(unitId, bills) {
        return api.postData('/api/MobileMethod/SaveFee', { bills: JSON.stringify(bills) });
    },
    invalidBillForm(keyValue) {
        return api.postData('/api/MobileMethod/InvalidBillForm', { keyValue });
    },
    billDetailList(billId) {
        return api.postData('/api/MobileMethod/MGetChargeBillDetailList', { billId });
    },

    //计算费用金额
    CalFee(isML, mlType, mlScale, ids) {
        return api.postData('/api/MobileMethod/MCalFee', { isML, mlType, mlScale, ids }, false);
    },
};
