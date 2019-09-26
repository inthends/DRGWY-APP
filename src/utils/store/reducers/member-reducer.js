import {ACTIONS} from '../action-types/action-types';

const initialState = {
    token: null,
};

const memberReducer = (state = initialState, action) => {
    switch (action.type) {
        case ACTIONS.token:
            return {...state, token: action.token};
        default:
            return state;
    }
};
export default memberReducer;
