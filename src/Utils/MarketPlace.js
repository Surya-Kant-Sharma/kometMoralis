import { ethers, Wallet } from 'ethers'
import { ToastAndroid } from 'react-native'
import marketPlaceABI from '../ABI/nftAbi.json'

const marketPlaceInit = async (options) => {
    const provider = await new ethers.providers.JsonRpcProvider("https://matic-mumbai.chainstacklabs.com")
    const sign = await new Wallet(options.privateKey, provider)
    const contractInstance = new ethers.Contract(options.contractAddress, marketPlaceABI, sign)
    return contractInstance
}

export const BuyNft = async (price, sign, contractAddress) => {
    const contract = await marketPlaceInit({ privateKey: sign , contractAddress : contractAddress});
    const options = { value: ethers.utils.parseEther(price.toString()), gasLimit : 3100000}
    try{
        const transactions = await contract.mintNFT(1, options)
    }
    catch (error){
        console.log('Error')
        ToastAndroid.show('Insufficient Funds',ToastAndroid.SHORT)
    }
    console.log(transactions)
    return transactions
}