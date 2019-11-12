import {ACTIONS} from '../action-types/action-types';

export function saveGoodsList(goodsList) {
    return {type: ACTIONS.save_goods_list, data: goodsList};
}

// function makeActionCreator(type, ...argNames) {
//     return function (...args) {
//         let action = {type};
//         argNames.forEach((arg, index) => {
//             action[argNames[index]] = args[index];
//         });
//         console.log('action', action);
//         return action;
//     };
// }
//
//
// export const addTodo = makeActionCreator(ACTIONS.save_goods_list, 'todo');

function makeActionCreator(type) {
    return function (...args) {
        let action = {...args, ...{type}};
        console.log('action', action);
        return action;
    };
}

export const addTodo = makeActionCreator(ACTIONS.save_goods_list);


export function saveToken(token) {
    return {type: ACTIONS.token, token: token};
}
export function saveUrl(url) {
    return {type:ACTIONS.url,url:url};
}

export function saveSelectBuilding(selectBuilding) {
    return {type: ACTIONS.selectBuilding, selectBuilding: selectBuilding};
}
