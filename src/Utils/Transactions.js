import { ethers, Wallet } from "ethers"
import { walletProvider } from "./Provider"


export const speedUpTransactions = async (to, from, amount, nonce, gasprice, pk) => {
    const tx = {
        to: to,
        from: from,
        value: amount,
        nonce: nonce,
        gasPrice: ethers.utils.formatUnits(gasprice, "wei"),
    }
    const provider = walletProvider()
    // const provider = await new ethers.providers.JsonRpcProvider("https://matic-mumbai.chainstacklabs.com")
    const wallet = await new Wallet(pk, provider)
    // const hexValue = new BigNumber.from(ethers.utils.formatUnits(options?.amount?.toString(), "wei"));
    // const hexValue = parseFloat(options?.amount).toPrecision(6).toString();
    // console.log("" + options?.amount?.toString());

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
    // const provider = await new ethers.providers.JsonRpcProvider("https://matic-mumbai.chainstacklabs.com")
    const wallet = await new Wallet(pk, provider)
    // const hexValue = new BigNumber.from(ethers.utils.formatUnits(options?.amount?.toString(), "wei"));
    // const hexValue = parseFloat(options?.amount).toPrecision(6).toString();
    // console.log("" + options?.amount?.toString());

    const hex = await wallet.sendTransaction(tx)

    return hex
}
