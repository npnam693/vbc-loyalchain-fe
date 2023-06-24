import { HOST_API } from "../constants/host";
import axiosClient from "./axiosClient";

class AuthorApi {
  login = (data) => {
    const url = HOST_API.concat("/users/authen/");
    return axiosClient.post(url, data);
  };
  signOut = () => {
    const url = HOST_API.concat("/users/logout/");
    return axiosClient.get(url);
  };
  verify = (data) => {
    const url = HOST_API.concat("/users/verify");
    return axiosClient.post(url, data);
  };
  sendVerify = (data) => {
    const url = HOST_API.concat("/users/verify/rawtx");
    return axiosClient.post(url, data);
  };
  resetPassword = (data) => {
    const url = HOST_API.concat("/users/authen/");
    return axiosClient.post(url, data);
  };
  register = (data) => {
    const url = HOST_API.concat("/users/register");
    return axiosClient.post(url, data);
  };
  getPath = () => {
    const url = HOST_API.concat("/users/path");
    return axiosClient.get(url);
  };
  sendRegister = (data) => {
    const url = HOST_API.concat("/users/register/rawtx");
    return axiosClient.post(url, data);
  };
  sendMail = (data) => {
    const url = HOST_API.concat("/users/verify/resend");
    return axiosClient.post(url, data);
  };
  sendOTP = (data) => {
    const url = HOST_API.concat("/users/phone/tokensms");
    return axiosClient.post(url, data);
  };
  verifyOTP = (data) => {
    const url = HOST_API.concat("/users/phone/verifycode");
    return axiosClient.post(url, data);
  };

}

const authApi = new AuthorApi();

export default authApi;
