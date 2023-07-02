import Web3 from "web3";
import axios from "axios";
import { Button, Popover } from "antd";
import { Personal } from "web3";
import PopoverUser from "./PopoverUser";
import { shortenAddress } from "../../../../utils/string";
import { saveInfo } from "../../../../state/user/userSlice";
import { saveWeb3 } from "../../../../state/web3/web3Slice";
import { SafetyCertificateTwoTone } from "@ant-design/icons";
import { initialUserState } from "../../../../state/user/userSlice";
import { useAppSelector, useAppDispatch } from "../../../../state/hooks";
import contractToken from '../../../../contract/Token/data.json';

const ConnectWallet = () => {
    const dispatch = useAppDispatch();

    const userState = useAppSelector((state) => state.userState);
    const web3State = useAppSelector((state) => state.Web3State);

    const signLogin = async (web3: any, userAddress: string) => {

        console.log(web3)

        const signature = await web3.eth.personal.sign(
            "Login",
            userAddress,
            ""
        );
        return signature;
    };

    const connectWallet = async () => {
        if (typeof window.ethereum !== "undefined") {
            const myWeb3 = new Web3(window.ethereum);
            const account = await window.ethereum.request({ method: "eth_requestAccounts" });
            console.log(account)
            const myUserState = Object.assign({}, initialUserState);
            myUserState.address = (await myWeb3.eth.getAccounts())[0];
            myUserState.network = String(await myWeb3.eth.net.getId());
            myUserState.balance = Number(
                await myWeb3.eth.getBalance(myUserState.address)
            );
            myUserState.isAuthenticated = true;
            const signature = await signLogin(myWeb3, myUserState.address);
            
            axios
                .post(
                    "http://localhost:3333/api/auth/login",
                    {
                        address: myUserState.address,
                        signature: signature,
                        message: "Login",
                    },  
                    { withCredentials: true }
                )
                .then((res) => {
                    myUserState.token = res.data.accessToken;
                    console.log(myUserState);
                    dispatch(saveInfo(myUserState));
                    dispatch(saveWeb3({ web3: myWeb3, isConnected: true }));

                    window.ethereum.on('accountsChanged', function (accounts: any) {
                        dispatch(saveInfo({
                            ...myUserState, address: accounts[0], balance: Number(
                                myWeb3.eth.getBalance(myUserState.address)
                            )
                        }));
                    })
                    window.ethereum.on("networkChanged", function (networkId: any) {
                        dispatch(saveInfo({
                            ...myUserState, network: networkId
                        }));
                    })
                })
                .catch((err) => {
                    console.log("error");
                });
        } else {
            alert("MetaMask is not installed");
        }
    };

      const Deploycontract = async () => {
        let contract = new web3State.web3.eth.Contract(
          JSON.parse(JSON.stringify(contractToken)).abi
        );
        const deploy = contract.deploy({
          data: JSON.parse(JSON.stringify(contractToken)).bytecode,
          arguments: [
            "huhu",
            "khocr",
            ["0x2a5b956d042f745835bcae7c75a9c806c20af371"],
          ],
        });

        const deployTransaction = deploy.send({
          from: userState.address,
          gas: 2100000,
        });

        // const recipt = await web3Api.eth.getTransactionReceipt(
        //   "0x457d89c09be00fe61dba08515a17661088f5f1236561b6ee58f13aefcbf79b7d"
        // );

        // console.log(recipt);

        // const deploy = contract.deploy({
        //   data: myData.bytecode,
        // });

        // const deployTransaction = deploy.send({
        //   from: userState.address,
        //   gas: 0,
        // });

        // deployTransaction.on("confirmation", (confirmationNumber, receipt) => {
        //   if (confirmationNumber === 1) {
        //     console.log("Contract deployed successfully!");
        //     console.log("Contract address:", receipt.contractAddress);
        //   }
        // });
      };

    if (web3State.isConnected) {
        return (
            <Popover
                content={PopoverUser}
                placement={"bottomRight"}
            >
                <div className="header-popover--container">
                    <div className="network">
                        <SafetyCertificateTwoTone
                            rev={""}
                            size={10}
                            className="network-icon"
                        />
                        <p>AGD</p>
                    </div>
                    <Button type="primary" className="btn-connect_wallet">
                        {shortenAddress(userState.address)}
                    </Button>
                </div>
                <Button onClick={Deploycontract}>deploy</Button>
            </Popover>
        );
    } else {
        return (
            <>
                <Button
                    type="primary"
                    className="btn-connect_wallet"
                    onClick={connectWallet}
                    size="middle"
                >
                    Connect Wallet
                </Button>

            </>
        );
    }
};

export default ConnectWallet;
