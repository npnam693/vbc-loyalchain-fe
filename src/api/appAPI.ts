import axiosClient from "./axiosClient";
import axios from "axios";
import { APP_LOYALCHAIN_API } from "../constants/host";
class AppAPI {
    LOYALCHAIN_API: string;
    constructor(api: string | undefined) {
        this.LOYALCHAIN_API = api ? api : "http://localhost:3333/api";

        console.log("DCM API", api)
    }
    // Authen
    login = (data: any) => {
        const url = this.LOYALCHAIN_API.concat("/auth/login");
        return axios.post(url, data, {
            withCredentials: true,
        });
    }
    getNewToken =  () => {
        const url = this.LOYALCHAIN_API.concat("/auth/token");
        return axios.get(url, {
            withCredentials: true,
        });
    }

    // App
    getTokens = () => {
        console.log(this.LOYALCHAIN_API)
        const url = this.LOYALCHAIN_API.concat("/enterprises");  
        return axios.get(url);
    }
    
    getAllOrders = () => {
        const url = this.LOYALCHAIN_API.concat("/transactions/?page=1");
        return axios.get(url);
    }

    getOrdersWithFilter = (data: any) => {
        const url = this.LOYALCHAIN_API.concat("/transactions");
        return axios.get(url, {params: data});
    }
    
    getExchangeRate = (data : any) => {
        const url = this.LOYALCHAIN_API.concat(`/transactions/rate/${data.tokenId1}/${data.tokenId2}`);
        return axios.get(url);
    } 

    getStatisApp = () => {
        const url = this.LOYALCHAIN_API.concat("/transactions/general");
        return axios.get(url);
    }

    // App State
    createOrder = (data: any) => {
        const url = this.LOYALCHAIN_API.concat("/transactions/create");
        return axiosClient.post(url, {...data, transactionType: 'exchange'});
    }

    acceptOder = (txId: string, body?: any) => {
        const url = this.LOYALCHAIN_API.concat(`/transactions/${txId}/accept`);
        return axiosClient.patch(url, body);
    }
    cancelOrder = (txId: string) => {
        const url = this.LOYALCHAIN_API.concat(`/transactions/${txId}/cancel`);
        return axiosClient.patch(url);
    }
    updateStatusOrder = (txId: string, status: string) => {
        const url = this.LOYALCHAIN_API.concat(`/transactions/${txId}/progress`);
        return axiosClient.patch(url, {status: status});
    }
    getScretKey = (txId: string) => {
        const url = this.LOYALCHAIN_API.concat(`/transactions/${txId}/secretKey`);
        return axiosClient.get(url);
    }
    getSignatureAdmin = (txId: string, nonce: number) => {
        const url = this.LOYALCHAIN_API.concat(`/transactions/${txId}/sig/refund`)
        return axiosClient.post(url, {nonce: nonce})
    }


    createTransfer = (data: any) => {
        const url = this.LOYALCHAIN_API.concat("/transactions/create");
        return axiosClient.post(url, {
            ...data, 
            transactionType: 'transfer', 
            toTokenId: data.fromTokenId,
            toValue: 0,
        });
    }
    getUserOrder = (data: any) => {
        const url = this.LOYALCHAIN_API.concat("/users/tx");
        return axiosClient.get(url, {params: {...data, transactionType: 'exchange'}});
    }
    getUserHistory = (page: number) => {
        const url = this.LOYALCHAIN_API.concat("/users/tx");
        return axiosClient.get(url, {params: {status: 2, page}});
    }
}

const LOYALCHAIN_API = APP_LOYALCHAIN_API
const appApi = new AppAPI(LOYALCHAIN_API);

export default appApi;