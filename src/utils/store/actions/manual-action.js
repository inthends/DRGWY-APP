import {ACTIONS} from '../action-types/action-types';
import store from '../store';

export default {
    saveTokenByStore(token) {
        store.dispatch({type: ACTIONS.token, token: token});
    },
    getTokenBYStore() {
        return store.getState().memberReducer.token;
    },
    getUrl() {
        return store.getState().memberReducer.url;
    }
};


