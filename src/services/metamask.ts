import { mappingNetwork } from "../utils/blockchain";

export const requestChangeNetwork = async (chainID: number) => {
    alert(`Switch to ${mappingNetwork(chainID)} Select Token`)
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x' + chainID.toString(16) }], // chainId must be in hexadecimal numbers
      });
    } catch (error) {
      console.log(error)                        
    }
} 