import {ACTIONS} from '../action-types/action-types';

const initialState = {
    xunJianData: {
        allData:{},
        lists:[],
        scanLists:[]
    },
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
