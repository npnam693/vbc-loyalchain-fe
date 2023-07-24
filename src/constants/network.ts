export const CHAIN_ID = [4444, 8888]

export const SYMBOL = ["MBC", "AGD"]

export const CHAIN_NAME = ["MBC Network", "AGD Network"]

export const AGD_NETWORK = {
    RPC: 'https://agridential.vbchain.vn/VBCinternship2023',
    chainId: 8888 
}

export const MBC_NETWORK = {
    RPC: 'https://mbctest.vbchain.vn/VBCinternship2023',
    chainId: 4444
}

interface IRPC_URL {
    [key: number]: string
}
export const RPC_URL : IRPC_URL= {
    4444: 'https://mbctest.vbchain.vn/VBCinternship2023',
    8888: 'https://agridential.vbchain.vn/VBCinternship2023'
}