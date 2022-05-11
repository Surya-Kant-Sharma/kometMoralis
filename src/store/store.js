import {createStore} from 'redux';
import Reducer from './Reducers/reducer';

const appStore = createStore(Reducer);

export default appStore;
