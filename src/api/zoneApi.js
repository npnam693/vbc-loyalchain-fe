import { HOST_BECAS, HOST_BECAS_API } from "../constants/host";
import axiosClient from "./axiosClient";

class ZoneApi {
  getList = (params) => {
    const url = HOST_BECAS_API.concat("/zones");
    return axiosClient.get(url, { params });
  };
}

const zoneApi = new ZoneApi();

export default zoneApi;
