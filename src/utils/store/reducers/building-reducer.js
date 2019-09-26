import {ACTIONS} from '../action-types/action-types';

const initialState = {
    selectBuilding: null,
};

const buildingReducer = (state = initialState, action) => {
    switch (action.type) {
        case ACTIONS.selectBuilding:
            return {...state, selectBuilding: action.selectBuilding};
        default:
            return state;
    }
};
export default buildingReducer;
