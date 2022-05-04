import {ACTIONS} from '../action-types/action-types';

const initialState = {
    selectBuilding: null,
    selectTask: null,
};

const buildingReducer = (state = initialState, action) => {
    switch (action.type) {
        case ACTIONS.selectBuilding:
            return { ...state, selectBuilding: action.selectBuilding };
        case ACTIONS.selectTask:
            return {...state, selectTask: action.selectTask};
        default:
            return state;
    }
};
export default buildingReducer;
