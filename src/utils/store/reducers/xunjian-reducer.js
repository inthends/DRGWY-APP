import {ACTIONS} from '../action-types/action-types';

const initialState = {
    //待巡检任务
    xunJianData: {
        allData:{},
        lists:[],
        scanLists:[]
    },
    //实际巡检数据
    xunJianAction:{
    }
};

const xunJianReducer = (state = initialState, action) => {
    switch (action.type) {
        case ACTIONS.xunJianData:
            return {...state, xunJianData: action.xunJianData};
        case ACTIONS.xunJianAction:
            return {
                ...state,
                xunJianAction: {
                    ...state.xunJianAction,
                    ...action.data
                }
            }
        default:
            return state;
    }
};
export default xunJianReducer;
