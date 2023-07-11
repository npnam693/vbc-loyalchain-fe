import Web3 from "web3";
import axios from "axios";
import { toast } from 'react-toastify'
import { Button, Popover } from "antd";
import { SafetyCertificateTwoTone } from "@ant-design/icons";

import PopoverUser from "./PopoverUser";
import { saveWeb3 } from "../../../../state/app/appSlice";
import { IUserState, saveInfo } from "../../../../state/user/userSlice";
import { useAppSelector, useAppDispatch } from "../../../../state/hooks";
import { fixStringBalance, shortenAddress } from "../../../../utils/string";
import { getBalanceAccount, mappingNetwork } from "../../../../utils/blockchain";
import { runLoading, stopLoading } from "../../../../state/loading/loadingSlice";

const SIGN_MESSAGE = "Verify Account"

const ConnectWallet = () => {
    const dispatch = useAppDispatch();
    const userState = useAppSelector((state) => state.userState);
    const appState = useAppSelector((state) => state.appState);
    
    const signatureLogin = async (web3: any, userAddress: string) : Promise<string> => {
        return await web3.eth.personal.sign(SIGN_MESSAGE, userAddress, "");
    };

    const hdAccountChange = async () => {
        console.log(hdAccountChange, userState, appState)
        // if(!appState.isConnectedWallet) return?
        // else {
            toast("Account changed, please wait a moment...")

            dispatch(runLoading())
            const myWeb3 = new Web3(window.ethereum);
            const address = (await myWeb3.eth.getAccounts())[0];
            const signature = await signatureLogin(myWeb3, address);
            axios
            .post("http://localhost:3333/api/auth/login", {
                address: address,
                signature: signature,
                message: "Verify Account",
            }, { withCredentials: true }
            ).then(async (res) => {
                const myUserState : IUserState = {
                    address:  address,
                    token: res.data.accessToken,
                    network: Number(await myWeb3.eth.net.getId()),
                    wallet: [],
                    balance:fixStringBalance(String(
                        await myWeb3.eth.getBalance(address)
                    ), 18),
                    isAuthenticated: true,
                    signature: signature,
                    createdAt: res.data.user.createdAt
                }
                myUserState.wallet = await getBalanceAccount(myWeb3, myUserState, appState.tokens)
                dispatch(saveInfo(myUserState));
                dispatch(saveWeb3(myWeb3));
                dispatch(stopLoading())
                toast.success("Connect wallet successfully!");
            })
        // }
    }

    const hdNetworkChange = async () => {
        console.log(hdAccountChange, userState, appState)
        toast("Network changed, please wait a moment...")
        dispatch(runLoading())
        const myWeb3 = new Web3(window.ethereum);
        const address = (await myWeb3.eth.getAccounts())[0];
        
        const myUserState : IUserState = {
            address:  address,
            token: userState.token,
            network: Number(await myWeb3.eth.net.getId()),
            wallet: [],
            balance:fixStringBalance(String(
                await myWeb3.eth.getBalance(address)
            ), 18),
            isAuthenticated: true,
            signature: userState.signature,
            createdAt: userState.createdAt
        }
        myUserState.wallet = await getBalanceAccount(myWeb3, myUserState, appState.tokens)
        dispatch(saveInfo(myUserState));
        dispatch(saveWeb3(myWeb3));
        dispatch(stopLoading())
        toast.success("Connect wallet successfully!");
    }

    const connectWallet = async () => {
        // toast("Connecting to wallet...")
        const id = toast.loading("Connecting to wallet...")

        if (typeof window.ethereum !== "undefined") {
            // dispatch(runLoading())
            const myWeb3 = new Web3(window.ethereum);
            await window.ethereum.request({ method: "eth_requestAccounts" });
            const address = (await myWeb3.eth.getAccounts())[0];

            const signature = await signatureLogin(myWeb3, address);
            console.log(signature)
            axios
                .post("http://localhost:3333/api/auth/login", {
                        address: address,
                        signature: signature,
                        message: "Verify Account",
                    }, { withCredentials: true }
                ).then(async (res) => {
                    const myUserState : IUserState = {
                        address:  address,
                        token: res.data.accessToken,
                        network: Number(await myWeb3.eth.net.getId()),
                        wallet: [],
                        balance:fixStringBalance(String(
                            await myWeb3.eth.getBalance(address)
                        ), 18),
                        isAuthenticated: true,
                        signature: signature,
                        createdAt: res.data.user.createdAt
                    }
                    myUserState.wallet = await getBalanceAccount(myWeb3, myUserState, appState.tokens)
                    console.log(myUserState);
                    dispatch(saveInfo(myUserState));
                    dispatch(saveWeb3(myWeb3));
                    dispatch(stopLoading())
                    // toast.success("Connect wallet success");
                    toast.update(id, { render: "All is good", type: "success", isLoading: false, autoClose: 1000});

                    if (!appState.isListening) {
                        window.ethereum.on("accountsChanged", hdAccountChange)
                        window.ethereum.on("chainChanged", hdNetworkChange)
                    }
                })
                .catch((err) => {
                    dispatch(stopLoading())
                    console.log("error");
                });
        } else {
            alert("MetaMask is not installed");
        }
    };

    // const Deploycontract = async () => {
    //     let contract = new web3State.web3.eth.Contract(
    //       JSON.parse(JSON.stringify(contractToken)).abi
    //     );
    //     const deploy = contract.deploy({
    //       data: JSON.parse(JSON.stringify(contractToken)).bytecode,
    //       arguments: [
    //         "Singapore Airlines Loyalty Point",
    //         "SAP",
    //         ["0x6225D07A59be4F47400E8885d8EFC78FF7D9e171"],
    //       ],
    //     });

    //     const deployTransaction = await deploy.send({
    //       from: userState.address,
    //       gas: 2100000,
    //     });

    //     console.log(deployTransaction);
    //     // const recipt = await web3Api.eth.getTransactionReceipt(
    //     //   "0x457d89c09be00fe61dba08515a17661088f5f1236561b6ee58f13aefcbf79b7d"
    //     // );

    //     // console.log(recipt);

    //     // const deploy = contract.deploy({
    //     //   data: myData.bytecode,
    //     // });

    //     // const deployTransaction = deploy.send({
    //     //   from: userState.address,
    //     //   gas: 0,
    //     // });

    //     // deployTransaction.on("confirmation", (confirmationNumber, receipt) => {
    //     //   if (confirmationNumber === 1) {
    //     //     console.log("Contract deployed successfully!");
    //     //     console.log("Contract address:", receipt.contractAddress);
    //     //   }
    //     // });
    // };

    if (appState.isConnectedWallet) {
        return (
            <Popover
                content={<PopoverUser hdNetworkChange={hdNetworkChange} hdAccountChange={hdNetworkChange}/>}
                placement={"bottomRight"}
            >
                <div className="header-popover--container">
                    <div className="network">
                        <SafetyCertificateTwoTone
                            rev={""}
                            size={10}
                            className="network-icon"
                        />
                        <p>{mappingNetwork(userState.network)}</p>
                    </div>
                    <Button type="primary" className="btn-connect_wallet">
                        {shortenAddress(userState.address)}
                    </Button>
                </div>
                {/* <Button onClick={Deploycontract}>deploy</Button> */}
            </Popover>
        );
    } else {
        return (
            <>
                <Button
                    type="primary"
                    className="btn-connect_wallet"
                    onClick={() => connectWallet()}
                    size="middle"
                >
                    Connect Wallet
                </Button>

            </>
        );
    }
};

export default ConnectWallet;
