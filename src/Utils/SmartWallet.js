import { ethers, Wallet, utils, BigNumber } from "ethers";
import { parseEther } from "ethers/lib/utils";
import factoryABI from '../ABI/factoryWallet.json';
import kometWalletAbi from '../ABI/kometWallet.json';
import { setDataLocally } from "./AsyncStorage";
import { Locations } from './StorageLocations';

const ContractInit = async (options) => {
    const provider = await new ethers.providers.JsonRpcProvider("https://matic-mumbai.chainstacklabs.com")
    const sign = await new Wallet(options.privateKey, provider)
    const contractInstance = new ethers.Contract('0x169bf5a795007da6a48f4bcd311c308b5548986a', factoryABI, sign)
    return contractInstance
}

const KometWalletInit = async (options) => {
    const provider = await new ethers.providers.JsonRpcProvider("https://matic-mumbai.chainstacklabs.com")
    const sign = await new Wallet(options.privateKey, provider)
    const contractInstance = new ethers.Contract('0x545a80f92898864E5B151053cd10FAAf08bb7337', kometWalletAbi, sign)
    return contractInstance
}
export const createSmartWallet = async (options) => {
     console.log('Options',options)
    
     const contractInit = await ContractInit(options)
    await contractInit.createWallet(options.name)

    contractInit.on("WalletCreated", async (owner, smartWallet) => {
        console.log('Wallet Creted',owner, smartWallet)
        if (owner.toString() === options.address.toString()) {
            console.log("successfully create ACCOUNT => ", smartWallet)
            const data = {
                address: smartWallet,
                name: options?.name
            }
            await setDataLocally(Locations.SMARTACCOUNTS, data)
        }
    })

    return contractInit
}

export const isVault = async (options) => {
    const ci = await ContractInit(options)
    const smartWalletAccounts = await ci.contracts(options.address);
    // console.log(smartWalletAccounts)
    return smartWalletAccounts
}

export const getSmartWalletBalance = async (options) => {
    const ci = await KometWalletInit(options)
    const smartWalletAccounts = await ci._getBalance(options.address.toString());
    return ethers.utils.formatEther(parseInt(smartWalletAccounts).toString())
}

export const smartWalletToEoa = async (options) => {
    const kometinit = await KometWalletInit(options);
    // const hex = Object.values(ethers.utils.parseUnits(options.amount, "ether"))
    console.log('transfer')
    const transactionHash = await kometinit.transfer(options?.from, options?.to, ethers.utils.parseEther(options?.amount?.toString()))
    console.log(transactionHash)
    return transactionHash;
}
// export const smartWalletToEoa = async (options) => {
//     const provider = await new ethers.providers.JsonRpcProvider("https://matic-mumbai.chainstacklabs.com")
//     const wallet = await new Wallet(options.privateKey, provider)
//     // const hexValue = new BigNumber.from(ethers.utils.formatUnits(options?.amount?.toString(), "wei"));
//     const hexValue = parseFloat(options?.amount).toPrecision(6).toString();
//     console.log("" + options?.amount?.toString());
//     const tx = {
//         to: options?.to,
//         value: ethers.utils.parseEther(options?.amount?.toString()),
//         gasLimit: 31000
//     }
//     const hex = await wallet.sendTransaction(tx)
//     console.log(hex)
//     return hex
// }
export const transferToSmartWallet = async (options) => {
    const provider = await new ethers.providers.JsonRpcProvider("https://matic-mumbai.chainstacklabs.com")
    const wallet = await new Wallet(options.privateKey, provider)
    // const hexValue = new BigNumber.from(ethers.utils.formatUnits(options?.amount?.toString(), "wei"));
    const hexValue = parseFloat(options?.amount).toPrecision(6).toString();
    // console.log("" + options?.amount?.toString());
    const tx = {
        to: options?.to,
        value: ethers.utils.parseEther(options?.amount?.toString()),
        gasLimit: 31000
    }
    const hex = await wallet.sendTransaction(tx)
    // console.log(hex)
    return hex
}