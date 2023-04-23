import {createStore, combineReducers} from 'redux';
import memberReducer from './reducers/member-reducer';
import buildingReducer from './reducers/building-reducer';
import xunJianReducer from './reducers/xunjian-reducer';
import {persistStore, persistReducer} from 'redux-persist';
// import storage from 'redux-persist/lib/storage';
import AsyncStorage from '@react-native-community/async-storage';
// import storageSession from "redux-persist/es/storage/session";

const reducers = combineReducers({
    memberReducer,
    buildingReducer,
    xunJianReducer,
});
const storageConfig = {
    key: 'root', // 必须有的
    storage: AsyncStorage, // 缓存机制
    blacklist: [], // reducer 里不持久化的数据,除此外均为持久化数据
};
const myPersistReducer = persistReducer(storageConfig, reducers);
const store = createStore(myPersistReducer);
export const persistor = persistStore(store);
export default store;
