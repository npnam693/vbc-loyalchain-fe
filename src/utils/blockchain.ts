import { useAppDispatch } from "../state/hooks"
import { saveInfo } from "../state/user/userSlice"
import { saveWeb3 } from "../state/web3/web3Slice"
import tokenData from '../contract/Token/data.json'
import { IUserState } from "../state/user/userSlice"
import { IToken } from "../state/token/tokenSlice"


const getBalanceToken = async (web3State: any, userState: IUserState, token: IToken) => {
    const tokenABI = tokenData.abi; // Thêm ABI của token vào đây
    const tokenContract = new web3State.eth.Contract(tokenABI, token.deployedAddress);
    const balance = await tokenContract.methods.balanceOf(userState.address).call(
        {from: userState.address}
        )
    return balance
}


export const getBalanceAccount = async (myWeb3: any, userState: IUserState, tokenState: IToken[]) => {
    const newWallet : any = Array(tokenState.length)


    const tokensInMyNetwork = tokenState.filter((value) => value.network === userState.network)

    const tokenContract = new myWeb3.eth.Contract(JSON.parse(JSON.stringify(tokenData)).abi, tokensInMyNetwork[0].deployedAddress);
    
    console.log(tokenContract)
    const balance = tokenContract.methods.balanceOf(userState.address).call({from: userState.address})
    // const balance = await tokenContract.methods.balanceOf(userState.address).call()
    // return balance
    // Promise.all(tokensInMyNetwork.map((token: IToken) => getBalanceToken(web3State, userState, token)))
    // .then(results => {
    //     // Xử lý kết quả từ các task
    //     console.log(results)
    //     results.map((value, index) => {
    //         newWallet[index] = value
    //     })
    //     console.log('wallet', newWallet)
    //     userState.wallet = newWallet
    // })
    // .catch(error => {
    //     console.log(error)
    //     return []
    // });
    
}
