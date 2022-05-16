import React from "react";
import App from "./App";
import { Providers } from "./Providers";
import RootNavigation from '../src/index'
import { LogBox } from "react-native";
import { Provider, useDispatch, useSelector } from 'react-redux';
import appStore from '../src/store/store.js'
export default () => {
  LogBox.ignoreAllLogs(true)
  return(
    
  <Providers>

     {/* <App/>  */}
      <Provider store={appStore}>
     <RootNavigation /> 
     </Provider>
  </Providers>
)};
