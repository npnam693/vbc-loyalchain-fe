import TokenContractData from '../contract/Token/data.json'
import SwapOneChainData from '../contract/SwapOneChain/data.json'
import SwapTwoChainData from '../contract/SwapTwoChain/data.json'
import FaucetTokenData from '../contract/FaucetToken/data.json'

import { MBC_EXCHANGE_ONE_ADDRESS, AGD_EXCHANGE_ONE_ADDRESS, 
    MBC_EXCHANGE_TWO_ADDRESS, AGD_EXCHANGE_TWO_ADDRESS,
    MBC_FAUCET_ADDRESS, AGD_FAUCET_ADDRESS
} from '../constants/contracts'

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

export const getSwapTwoContract = (web3 : any, chainID: number) => {
    if (chainID === 8888) {
        return new web3.eth.Contract(
            SwapTwoChainData.abi, AGD_EXCHANGE_TWO_ADDRESS
        )
    } else {
        return new web3.eth.Contract(
            SwapTwoChainData.abi, MBC_EXCHANGE_TWO_ADDRESS
        )
    }
}

export const getFaucetContract = (web3: any, chainID: number) => {
    if (chainID === 8888) {
        return new web3.eth.Contract(
            FaucetTokenData.abi, AGD_FAUCET_ADDRESS
        )
    } else {
        return new web3.eth.Contract(
            FaucetTokenData.abi, MBC_FAUCET_ADDRESS
        )
    }
}
