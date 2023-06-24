import { AnyAction, combineReducers } from "@reduxjs/toolkit";
import userState, { logOut } from "./user/userSlice";
import alertState from "./alert/alertSlice";
import popupState from "./popup/popupSlice";

import ThemeOptions from "./themeOptions/themeOptionsSlice";

const appReducer = combineReducers({
  //authen
  userState,

  //noti
  alertState,
  popupState,


  //theme
  ThemeOptions,
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
