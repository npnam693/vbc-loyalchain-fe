import axiosClient from "./axiosClient";
// import { LOYALCHAIN_API } from "../constants/host";
import axios from "axios";

const LOYALCHAIN_API = "http://localhost:3333/api"
class AppAPI {
    // Authen
    login = (data: any) => {
        if (LOYALCHAIN_API === undefined) return;
        const url = LOYALCHAIN_API.concat("/auth/login");
        return axios.post(url, data, {
            withCredentials: true,
        });
    }
    getNewToken =  () => {
        if (LOYALCHAIN_API === undefined) return;
        const url = LOYALCHAIN_API.concat("/auth/token");
        return axios.get(url, {
            withCredentials: true,
        });
    }

    // App
    getTokens = () => {
        console.log(LOYALCHAIN_API)
        if (LOYALCHAIN_API === undefined) return;
        const url = LOYALCHAIN_API.concat("/enterprises");  
        return axios.get(url);
    }
    
    getAllOrders = () => {
        if (LOYALCHAIN_API === undefined) return;
        const url = LOYALCHAIN_API.concat("/transactions/?page=1");
        return axios.get(url);
    }

    getOrdersWithFilter = (data: any) => {
        if (LOYALCHAIN_API === undefined) return;
        const url = LOYALCHAIN_API.concat("/transactions");
        return axios.get(url, {params: data});
    }
    
    getExchangeRate = (data : any) => {
        if (LOYALCHAIN_API === undefined) return;
        const url = LOYALCHAIN_API.concat(`/transactions/rate/${data.tokenId1}/${data.tokenId2}`);
        return axios.get(url);
    } 

    getStatisApp = () => {
        if (LOYALCHAIN_API === undefined) return;
        const url = LOYALCHAIN_API.concat("/transactions/general");
        return axios.get(url);
    }

    // App State
    createOrder = (data: any) => {
        if (LOYALCHAIN_API === undefined) return;
        const url = LOYALCHAIN_API.concat("/transactions/create");
        return axiosClient.post(url, {...data, transactionType: 'exchange'});
    }

    acceptOder = (txId: string, body?: any) => {
        if (LOYALCHAIN_API === undefined) return;
        const url = LOYALCHAIN_API.concat(`/transactions/${txId}/accept`);
        return axiosClient.patch(url, body);
    }
    cancelOrder = (txId: string) => {
        if (LOYALCHAIN_API === undefined) return;
        const url = LOYALCHAIN_API.concat(`/transactions/${txId}/cancel`);
        return axiosClient.patch(url);
    }
    updateStatusOrder = (txId: string, status: string) => {
        if (LOYALCHAIN_API === undefined) return;
        const url = LOYALCHAIN_API.concat(`/transactions/${txId}/progress`);
        return axiosClient.patch(url, {status: status});
    }
    getScretKey = (txId: string) => {
        if (LOYALCHAIN_API === undefined) return;
        const url = LOYALCHAIN_API.concat(`/transactions/${txId}/secretKey`);
        return axiosClient.get(url);
    }


    createTransfer = (data: any) => {
        if (LOYALCHAIN_API === undefined) return;
        const url = LOYALCHAIN_API.concat("/transactions/create");
        return axiosClient.post(url, {
            ...data, 
            transactionType: 'transfer', 
            toTokenId: data.fromTokenId,
            toValue: 0,
        });
    }

    getUserOrder = (data: any) => {
        if (LOYALCHAIN_API === undefined) return;
        const url = LOYALCHAIN_API.concat("/users/tx");
        return axiosClient.get(url, {params: data});
    }
}

const appApi = new AppAPI();

export default appApi;