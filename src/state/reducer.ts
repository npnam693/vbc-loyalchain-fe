import { AnyAction, combineReducers } from "@reduxjs/toolkit";

import userState from "./user/userSlice";
import ThemeOptions from "./themeOptions/themeOptionsSlice";
import loadingState from "./loading/loadingSlice";
import appState from './app/appSlice'
import taskState from './task/taskSlice'

const appReducer = combineReducers({
  //authen
  userState,
  
  // app
  appState,
  taskState,

  //theme
  ThemeOptions,
  loadingState,
});

// const rootReducer = (state: any, action:AnyAction) => {
//   if(action.type === 'userState/logOut'){
//       state = undefined;
//       return state
//   }
//   return appReducer(state, action)
// }

export type RootState = ReturnType<typeof appReducer>

export default appReducer;
