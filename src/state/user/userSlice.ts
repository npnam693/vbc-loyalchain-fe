import { createAction, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ImageAGD } from "../../types/image";

export interface LanguageImageObject {
  vi?: Array<ImageAGD>;
  en?: Array<ImageAGD>;
}

// export interface UserState {
//   address: string;
//   category: number;
//   email: string;
//   name: string;
//   phone: string;
//   publicPhone: string;
//   publicEmail: string;
//   pw_hash: string;
//   username: string;
//   uuid: string;
//   verifiedEmail: boolean;
//   verifiedPhone: boolean;
//   verifiedTxId: string;
//   website: string;
//   avatarLanguage: LanguageImageObject;
//   bannerLanguage: ImageAGD;
//   certificatesLanguage: Array<ImageAGD>;
//   dynamicDescription: string;
//   logoLanguage: Array<ImageAGD>;
//   privateEncrypted: string;
//   identifierAddress: string;
//   seedEncrypted: string;
//   role: ROLE;
//   type: ROLE;
//   token: string;
//   loading: boolean;
//   isAuthenticated: boolean;
//   expiresIn: number;
//   password: string;
//   bcAddress: string;
// }

// const initialState: UserState = {
//   address: "",
//   category: 0,
//   email: "",
//   name: "",
//   phone: "",
//   publicPhone: "",
//   publicEmail: "",
//   pw_hash: "",
//   username: "",
//   uuid: "",
//   verifiedEmail: false,
//   verifiedPhone: false,
//   verifiedTxId: "",
//   website: "",
//   avatarLanguage: {},
//   bannerLanguage: {
//     index: 0,
//     image: {
//       secure_url: "",
//     },
//   },
//   certificatesLanguage: [],
//   dynamicDescription: "",
//   logoLanguage: [],
//   privateEncrypted: "",
//   identifierAddress: "",
//   seedEncrypted: "",
//   role: ROLE.User,
//   type: ROLE.User,
//   token: "",
//   loading: true,
//   isAuthenticated: false,
//   expiresIn: 0,
//   password: "",
//   bcAddress: "",
// };
 

interface IBalance {
  symbol: string;
  balance: string;
}
interface UserState {
  address: string;
  token: string;
  network: string;
  // balance: IBalance[];
  balance: number;
  isAuthenticated: boolean;
}

export const initialUserState : UserState = {
  address: "",
  token: "",
  network: "",
  // balance: [],
  balance: 0,
  isAuthenticated: false,
}



const userSlice = createSlice({
  name: "userState",
  initialState: initialUserState,
  reducers: {
    saveInfo: (state, action: PayloadAction<UserState>) => {
      state = action.payload;
      return state
    },
    clearInfo: (state, action: PayloadAction<undefined>) => {
      state = initialUserState;
      return state;
    },
  },
});

const logOut = createAction("userState/logOut");

export const { saveInfo, clearInfo } = userSlice.actions;

export { logOut };

export default userSlice.reducer;
