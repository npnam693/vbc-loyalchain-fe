import axiosClient from "./axiosClient";
// import { LOYALCHAIN_API } from "../constants/host";

const LOYALCHAIN_API = "http://localhost:3333/api"
class AppAPI {
    getTokens = async () => {
        console.log(LOYALCHAIN_API)
        if (LOYALCHAIN_API === undefined) return;
        const url = LOYALCHAIN_API.concat("/enterprises");
        return axiosClient.get(url);
    }
    
    getAllOrders = async () => {
        if (LOYALCHAIN_API === undefined) return;
        const url = LOYALCHAIN_API.concat("/transactions/?page=2");
        return axiosClient.get(url);
    }

    getOrdersWithFilter = async (data: any) => {
        if (LOYALCHAIN_API === undefined) return;
        const url = LOYALCHAIN_API.concat("/transactions");
        return axiosClient.get(url, {params: data});
    }
    
    createOrder = async (data: any) => {
        if (LOYALCHAIN_API === undefined) return;
        const url = LOYALCHAIN_API.concat("/transactions/create");
        return axiosClient.post(url, {...data, transactionType: 'exchange'});
    }
    
    acceptOder = async (txId: string, txIDto: string) => {
        if (LOYALCHAIN_API === undefined) return;
        const url = LOYALCHAIN_API.concat(`/transactions/${txId}/accept`);
        return axiosClient.patch(url, {txIdTo: txIDto});
    }

    createTransfer = async (data: any) => {
        if (LOYALCHAIN_API === undefined) return;
        const url = LOYALCHAIN_API.concat("/transactions/create");
        return axiosClient.post(url, {
            ...data, 
            transactionType: 'transfer', 
            toTokenId: data.fromTokenId,
            toValue: 0,
        });
    }
}

const appApi = new AppAPI();

export default appApi;