import {ADDRESS, BALANCE, PROVIDER} from '../Actions/action';

const defaultState = {
  address: null,
  balance: 0,
  provider: null,
};

const Reducer = (state = defaultState, action) => {
  console.log('ActionType', action.type, action.payload);
  switch (action.type) {
    case ADDRESS:
      //console.log('User', );
      return {...state, address: action.payload};
    case BALANCE:
      //console.log('User', );
      return {...state, balance: action.payload};
    case PROVIDER:
      //console.log('User', );
      return {...state, provider: action.payload};
    default:
      console.log('Default Again');
      return {
        ...state,
      };
  }
};
export default Reducer;
