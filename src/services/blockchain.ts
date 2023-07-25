import Web3 from "web3"
import { IUserState } from "../state/user/userSlice"
import { RPC_URL } from "../constants/network"
import { getSwapTwoContract, getSwapOneContract} from "./contract"

export const generateContractID = (web3: any, orderID: string, fromAddress: string, toAddress: string) => {
    return web3.utils.soliditySha3(
        { type: "bytes32", value: web3.utils.keccak256(orderID)},
        { type: "address", value: fromAddress},
        { type: "address", value: toAddress}
    ) 
}


export const getTxTwoOnchain = async (contractID: string, chainID: number) => {
    const web3 = new Web3(new Web3.providers.HttpProvider(RPC_URL[chainID]))
    const contract = getSwapTwoContract(web3, chainID)
    const data = await contract.methods.transactions(contractID).call()
    return data;
}

export const getTxOneOnchain = async (contractID: string, chainID: number) => {
    const web3 = new Web3(new Web3.providers.HttpProvider(RPC_URL[chainID]))
    const contract = getSwapOneContract(web3, chainID)
    const data = await contract.methods.transactions(contractID).call()
    return data
}

