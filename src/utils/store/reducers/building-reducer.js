import { ACTIONS } from '../action-types/action-types';

const initialState = {
  selectDrawerType: '',
  selectBuilding: null 
};

const buildingReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.selectBuilding:
      return { ...state, selectBuilding: action.selectBuilding }; 
    case ACTIONS.selectDrawerType:
      return { ...state, selectDrawerType: action.selectDrawerType };
    default:
      return state;
  }
};

export default buildingReducer;
