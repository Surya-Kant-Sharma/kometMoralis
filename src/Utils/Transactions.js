import { ethers, Wallet } from "ethers"
import { walletProvider } from "./Provider"


export const speedUpTransactions = async (to, from, amount, nonce, gasprice, pk) => {
    const tx = {
        to: to,
        from: from,
        value: amount,
        nonce: nonce,
        gasPrice: ethers.utils.formatUnits(gasprice, "wei"),
        gasLimit: 60000,
    }
    const provider = walletProvider()
    const wallet = await new Wallet(pk, provider)
    const hex = await wallet.sendTransaction(tx)
    return hex
}
export const cancelTransactions = async (to, from, amount, nonce, gasprice, pk) => {
    const tx = {
        to: to,
        from: from,
        value: 0,
        nonce: nonce,
        gasPrice: ethers.utils.formatUnits(gasprice, "wei"),
    }
    const provider = walletProvider()
    const wallet = await new Wallet(pk, provider)
    const hex = await wallet.sendTransaction(tx)
    return hex
}
