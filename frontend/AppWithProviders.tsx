import React from "react";
import App from "./App";
import { Providers } from "./Providers";
import RootNavigation from '../src/index'
import { LogBox } from "react-native";
export default () => {
  LogBox.ignoreAllLogs(true)
  return(
  <Providers>

     {/* <App/>  */}
     <RootNavigation /> 
  </Providers>
)};
