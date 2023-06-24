import { HOST_BECAS } from "../constants/host";
import axiosClient from "./axiosClient";

class BayApi {
  getOverview = (params) => {
    const url = HOST_BECAS.concat("/users/authen/");
    return axiosClient.get(url, { params });
  };
}

const bayApi = new BayApi();

export default bayApi;
