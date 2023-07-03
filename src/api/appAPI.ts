import axiosClient from "./axiosClient";
import { LOYALCHAIN_API } from "../constants/host";

class AppAPI {
    getTokens = async () => {
        console.log(LOYALCHAIN_API)
        if (LOYALCHAIN_API === undefined) return;
        const url = LOYALCHAIN_API.concat("/enterprises");
        return axiosClient.get(url);
    }
}

const appApi = new AppAPI();

export default appApi;