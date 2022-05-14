import { ADDRESS, EOABALANCE, VAULTBALANCE, PROVIDER,OTHERWALLET,WALLETS } from '../Actions/action';

const defaultState = {
  address: null,
  eoaBalance: 0,
  vaultBalance: 0,
  provider: null,
  wallets:[],
  otherWallet:null
};

const Reducer = (state = defaultState, action) => {
  console.log('ActionType', action.type, action.payload);
  switch (action.type) {
    case ADDRESS:
      //console.log('User', );
      return { ...state, address: action.payload };
    case EOABALANCE:
      //console.log('User', );
      return { ...state, eoaBalance: action.payload };
    case VAULTBALANCE:
      //console.log('User', );
      return { ...state, vaultBalance: action.payload };
    case PROVIDER:
      //console.log('User', );
      return { ...state, provider: action.payload };
      case OTHERWALLET:
        //console.log('User', );
        return {...state, otherWallet: action.payload};  
    case WALLETS:
      return {...state, wallets: action.payload};
      default:
      console.log('Default Again');
      return {
        ...state,
      };
  }
};
export default Reducer;
