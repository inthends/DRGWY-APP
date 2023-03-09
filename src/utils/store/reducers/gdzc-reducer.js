import {ACTIONS} from '../action-types/action-types';

const initialState = {
    gdzcData: {
        allData:{},
        lists:[],
        scanLists:[]
    },
    gdzcAction:{

    }
};

const gdzcReducer = (state = initialState, action) => {
    switch (action.type) {
        case ACTIONS.gdzcData:
            return {...state, gdzcData: action.gdzcData};
        case ACTIONS.gdzcAction:
            return {
                ...state,
                gdzcAction: {
                    ...state.gdzcAction,
                    ...action.data
                }
            }
        default:
            return state;
    }
};
export default gdzcReducer;
