import { useAppDispatch } from "../state/hooks"
import { saveInfo } from "../state/user/userSlice"
import { saveWeb3 } from "../state/web3/web3Slice"
import tokenData from '../contract/Token/data.json'
import { IUserState } from "../state/user/userSlice"
import { IToken } from "../state/token/tokenSlice"
import { fixStringBalance } from "./string"

const getBalanceToken = async (myWeb3: any, userState: IUserState, token: IToken) => {
    const tokenABI = tokenData.abi; // Thêm ABI của token vào đây
    const tokenContract = new myWeb3.eth.Contract(tokenABI, token.deployedAddress);
    let balance = await tokenContract.methods.balanceOf(userState.address).call(
        {from: userState.address}
    )
    const decimals = await tokenContract.methods.decimals().call({from: userState.address})
    
    balance = fixStringBalance(balance.toString(), Number(decimals))
    return {token, balance}
}


export const getBalanceAccount = async (myWeb3: any, userState: IUserState, tokenState: IToken[]) => {
    const tokensInMyNetwork = tokenState.filter((value) => value.network === userState.network)
    const newWallet : any = Array(tokensInMyNetwork.length)
    Promise.all(tokensInMyNetwork.map((token: IToken) => getBalanceToken(myWeb3, userState, token)))
    .then(results => {
        // Xử lý kết quả từ các task
        console.log(results)
        results.map((value, index) => {
            newWallet[index] = value
        })
        userState.wallet = newWallet
    })
    .catch(error => {
        console.log(error)
        return []
    });
}

export const mappingNetwork = (chainID: number) => {
    if (chainID === 4444) return "AGD Network"
    else if (chainID === 8888) return "MBC Testnet"
}

export const mappingCurrency = (chainID: number) => {
    if (chainID === 4444) return "MBC"
    else if (chainID === 8888) return "AGD"
}
