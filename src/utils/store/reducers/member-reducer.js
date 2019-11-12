import {ACTIONS} from '../action-types/action-types';

const initialState = {
    token: null,
    url: null,
};

const memberReducer = (state = initialState, action) => {
    switch (action.type) {
        case ACTIONS.token:
            return {...state, token: action.token};
        case ACTIONS.url:
            return {...state,url:action.url};
        default:
            return state;
    }
};
export default memberReducer;
