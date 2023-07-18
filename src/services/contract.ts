import TokenContractData from '../contract/Token/data.json'
import SwapOneChainData from '../contract/SwapOneChain/data.json'

import { MBC_EXCHANGE_ONE_ADDRESS, AGD_EXCHANGE_ONE_ADDRESS } from '../constants/contracts'

export const getTokenContract = (web3 : any, address : string) => {
    return new web3.eth.Contract(
        TokenContractData.abi, address
    )
}

export const getSwapOneContract = (web3 : any, chainID : number) => {
    if (chainID === 8888) {
        return new web3.eth.Contract(
            SwapOneChainData.abi, AGD_EXCHANGE_ONE_ADDRESS
        )
    } else {
        return new web3.eth.Contract(
            SwapOneChainData.abi, MBC_EXCHANGE_ONE_ADDRESS
        )
    }
}