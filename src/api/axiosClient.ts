import axios from "axios";
import queryString from "query-string";
import { toast } from "react-toastify";
import store from "../state";
import { clearInfo, updateToken } from "../state/user/userSlice";
import appApi from "./appAPI";
import jwt_decode from "jwt-decode";
const getToken = async () => {
  let storeData = store.getState();
  let currentTime = new Date();
  const res = await appApi.getNewToken()
  console.log(res)
  console.log(storeData.userState.expiredTime < currentTime)
  if (storeData && storeData.userState.expiredTime && storeData.userState.token) {
    if (storeData.userState.expiredTime < currentTime) {
      try {
        const res = await appApi.getNewToken()
        const token_decode : any = (jwt_decode(res?.data.accessToken))
        store.dispatch(
          updateToken({
            token: res?.data,
            expiredTime: new Date(token_decode.exp * 1000)
          })
        )
        console.log(res?.data)
      } catch (error) {
        console.log(error)
        store.dispatch(clearInfo());
      }
    } else {
      return storeData.userState.token;;
    }  
    return storeData.userState.token;
  } else {
    return "";
  }
};


const axiosClient = axios.create({
  baseURL: process.env.API_CORE_ENDPOINT,
  headers: {
    "content-type": "application/json",
  },
  paramsSerializer: (params) => {
    return queryString.stringify(params);
  },
});

axiosClient.interceptors.request.use(async (config) => {
  let token = await getToken();
  if (token) {
    config.headers = {
      Authorization: `Bearer ${token}`,
    };
  }
  config.timeout = 15000;
  return config;
});

axiosClient.interceptors.response.use(
  (response) => {
    if (response && response.data) {
      return response;
    }
    return response;
  },
  (error) => {
    // Handle errors
    if (error.response) {
      if (error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error(error.message);
      }
    } else if (error.request) {
      window.location.replace("/404");
    } else {
      window.location.replace("/404");
    }
    throw error;
  }
);
export default axiosClient;
