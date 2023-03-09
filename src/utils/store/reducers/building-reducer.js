import { ACTIONS, DrawerType } from '../action-types/action-types';

const initialState = {
  selectDrawerType: '',
  selectBuilding: null,
  selectTask: null,
};

const buildingReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.selectBuilding:
      return { ...state, selectBuilding: action.selectBuilding };
    case ACTIONS.selectTask:
      return { ...state, selectTask: action.selectTask };
    case ACTIONS.selectDrawerType:
      return { ...state, selectDrawerType: action.selectDrawerType };
    default:
      return state;
  }
};
export default buildingReducer;
