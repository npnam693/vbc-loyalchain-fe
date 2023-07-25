import React from 'react'
import { Button, Divider, Input, Tooltip } from 'antd'
import './Faucet.scss'
import SelectToken from '../../components/app/SelectToken'
import { useEffect, useState } from 'react'
import { getFaucetContract, getTokenContract } from '../../services/contract'
import { useAppDispatch, useAppSelector } from '../../state/hooks'
import { fixStringBalance } from '../../utils/string'
import { hdConnectWallet } from '../../layouts/components/header/helper/ConnectWallet'
import { requestChangeNetwork } from '../../services/metamask'
import Wallet from '../wallet'
import { getBalanceAccount, getLinkExplore } from '../../utils/blockchain'
import { saveInfo } from '../../state/user/userSlice'
import { LoadingOutlined, WarningOutlined } from '@ant-design/icons'
import { toast } from 'react-toastify'
import Countdown from 'antd/es/statistic/Countdown'
import store from '../../state'
const Faucet = () => {
    const {appState, userState} = useAppSelector(state => state)


    const [openSelect, setOpenSelect] = useState(false)
    const [tokenSelected, setTokenSelected] = useState<any>(null)
    const [selectedAmount, setSelectedAmount] = useState(0)
    const [balance, setBalance] = useState(-1)
    const [wallet, setWallet] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [txID, setTxID] = useState("")
    const [timeLock, setTimeLock] = useState(0)
    
    const dispatch = useAppDispatch()

    const onChangeWallet = async () => {
        const storeData = store.getState()
        if (wallet.length === 42 && tokenSelected !== null) {
            const tokenContract =  getTokenContract(storeData.appState.web3, 
                tokenSelected.token ? tokenSelected.token.deployedAddress : tokenSelected.deployedAddress
            )
            const faucetContract  = getFaucetContract(storeData.appState.web3, 
                tokenSelected.token ? tokenSelected.token.network : tokenSelected.network)

            let tokenBalance = await tokenContract.methods.balanceOf(wallet).call(
                {from: wallet}
            )
            const decimals = await tokenContract.methods.decimals().call({from: wallet})
            tokenBalance = fixStringBalance(tokenBalance.toString(), Number(decimals))
            setBalance(tokenBalance)
            
            const timeLock = await faucetContract.methods.timeLockUserToken(
                wallet,
                tokenSelected.token ? tokenSelected.token.deployedAddress : tokenSelected.deployedAddress,
            ).call({from: wallet})
            setTimeLock(Number(timeLock))
        }
    } 
    useEffect(() => {
        onChangeWallet()
    }, [wallet, tokenSelected]) 

    const onClickFaucet = async() => {
        if (!appState.isConnectedWallet) {
            alert("Connect wallet before faucet token");
            await hdConnectWallet()
            return;
        }

        if (tokenSelected === null) {
            alert("Sellect token before faucet token")
            return;
        }
        if (wallet === "") {
            alert("Enter wallet address before faucet token")
            return;
        }
        if (selectedAmount === 0) {
            alert("Select amount before faucet")
            return;
        }

        if ((tokenSelected.token ? tokenSelected.token.network : tokenSelected.network) !== userState.network) {
            requestChangeNetwork(tokenSelected.token ? tokenSelected.token.network : tokenSelected.network)
            return;
        }
        setIsLoading(true)
        const toaster = toast.loading(`Sending ${selectedAmount} ${tokenSelected.token ? tokenSelected.token.symbol : tokenSelected.symbol} to ${wallet.slice(0,4)+'...'+wallet.slice(-7)}`)
        const faucetContract  = getFaucetContract(appState.web3, tokenSelected.token ? tokenSelected.token.network : tokenSelected.network)
        
        const faucetMethod = faucetContract.methods.faucetToken(
            wallet,
            tokenSelected.token ? tokenSelected.token.deployedAddress : tokenSelected.deployedAddress,
            selectedAmount
        )
        try {
            await faucetMethod.estimateGas({from: userState.address})
            const faucetRecipt = await faucetMethod.send({from: userState.address})
            dispatch(saveInfo({...userState, wallet: await getBalanceAccount(appState.web3, userState, appState.tokens)}))
            setIsLoading(false)
            setTxID(faucetRecipt.transactionHash)
            toast.update(toaster, { render: `Sending ${selectedAmount} ${tokenSelected.token ? tokenSelected.token.symbol : tokenSelected.symbol} successfully.` , type: "success", isLoading: false, autoClose: 1000});
            onChangeWallet()
        } catch (error) {
            setIsLoading(false)
            toast.update(toaster, { render: "Send token failed.", type: "error", isLoading: false, autoClose: 1000});
        }
    }

    return (
    <div className='app-faucet'>
        <p className='title'>Faucet Loyalty Point</p>
        <p className='desc'>Faucet Loyalty Point is a reward for users who have contributed to the development of the project.</p>
        
        <div className='app-faucet-content'>
            <div className='select-container'>
                <p style={{fontWeight: 600}}>
                    Sellect Token: 
                </p>
                    <Button className='select-btn' onClick={() => setOpenSelect(true)} size='large'>
                        {
                            tokenSelected === null ?
                            "Click to select"
                            :
                            <div style={{display:'flex', flexDirection:'row', alignItems:'center'}}>
                                <img src={tokenSelected.token?.image || tokenSelected.image} alt='icon' className='icon' width={26}/>
                                <p style={{marginLeft: 10, fontSize: '1.6rem', fontWeight: 700}}>{tokenSelected.token?.symbol || tokenSelected.symbol}</p>
                            </div>
                        }
                    </Button>
                    {
                        <>
                            <p style={{fontSize:'1.4rem', fontWeight: 500}}>Token name: 
                                {
                                    tokenSelected && (
                                        <span style={{fontWeight: 400}}> {" "}
                                            {tokenSelected.token?.name || tokenSelected.name}
                                        </span>
                                    )
                                }
                            </p>
                        
                            <p style={{fontSize:'1.4rem', fontWeight: 500}}>Token address: 
                                {
                                    tokenSelected && (
                                        <span style={{fontWeight: 400}}> {" "}
                                            {tokenSelected.token?.deployedAddress || tokenSelected.deployedAddress}
                                        </span>
                                    )
                                }
                            </p>
                        </>                        

                    }
            </div>
            <div className='wallet-container'>
                <p  style={{fontWeight: 600}}>
                Your wallet:
                </p>
                <Input placeholder='Enter your address' className='input-address' size="large"
                    onChange={(e) => setWallet(e.target.value)}
                    status={wallet.length !== 42 ? 'warning' : ''}
                /> 
                {
                    <p style={{fontSize:'1.4rem', fontWeight: 500}}>Ballance: 
                    {
                        balance !== -1 && (
                            <span style={{fontWeight: 400, color: "var(--color-secondary)"}}> {" "}
                                {balance} {tokenSelected.token?.symbol || tokenSelected.symbol}
                            </span>
                        )    
                    }
                    </p>
                }
            </div>
            <div className='amount-container'>
                <p  style={{fontWeight: 600}}>
                Amount:
                </p>
                <div className='faucet-amount'>
                    <div style={selectedAmount === 10 ? {backgroundColor: "#c3e2fa"}: {}} 
                        onClick={() => setSelectedAmount(10)}
                    >10 tokens</div>
                    <div style={selectedAmount === 15 ? {backgroundColor: "#c3e2fa"}: {}} 
                        onClick={() => setSelectedAmount(15)}
                    >15 tokens</div>
                    <div style={selectedAmount === 20 ? {backgroundColor: "#c3e2fa"}: {}} 
                        onClick={() => setSelectedAmount(20)}
                    >20 tokens</div>
                </div>
            </div>
                
            <p style={{marginTop: 10, fontSize:'1.4rem', fontWeight: 500, color:'orange', width:'90%'}}>
              <WarningOutlined rev={""} /> Note:{" "}
              <span style={{fontSize:'1.4rem', fontWeight: 400, color: 'black'}}>
                Loyalchain is currently in the testing phase on 2 networks, MBC and AGD. 
                You will need gas fees on these networks to be able to faucet the corresponding tokens.
              </span>
            </p>       
            <Divider />
            {
                txID &&
                <p style={{fontSize:'1.4rem', fontWeight: 500}}>Transaction ID: 

                    <Tooltip title={(<div style={{cursor:'pointer'}} onClick={() => window.open(getLinkExplore(txID, userState.network), '_blank', 'noopener,noreferrer')}>View in explorer</div>)} placement='bottom'>
                        <p style={{ fontWeight: 400, marginBottom: 20 }}>
                        { txID }
                        </p>
                    </Tooltip>
                </p>                
            }
            {
                timeLock && timeLock * 1000 > Date.now() ? (
                    <Tooltip title="Time remaining until the next faucet loyalty token" placement='bottom'
                    
                    >
                        <div className='faucet-btn' onClick={() => {}} style={{cursor: "default"}}>
                            <Countdown value={timeLock * 1000} valueStyle={{fontSize: '1.4rem', fontWeight:700, color:'#ccc'}}/>
                        </div>
                    </Tooltip>
                ) : (
                    <div className='faucet-btn' onClick={onClickFaucet}>
                        {isLoading ? <LoadingOutlined rev={""} /> : 'FAUCET'}
                    </div>
                )
            }
        </div>
        {
            openSelect &&
            <SelectToken 
                closeFunction={() => setOpenSelect(false)}
                onClickSelect={(token) => {setTokenSelected(token); setOpenSelect(false); onChangeWallet()}}
                isCheckNetwork
            />
        }
    </div>
  )
}

export default Faucet