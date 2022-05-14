import AsyncStorage from '@react-native-async-storage/async-storage'
import {Wallet, ethers, utils} from 'ethers'

const getAccountDetails = async (mnemonic) => {
    try {
        const walletMnemonic = Wallet.fromMnemonic(mnemonic)
        const walletPrivateKey = new Wallet(walletMnemonic.privateKey)
        walletMnemonic.address === walletPrivateKey.address
        const address = await walletMnemonic.getAddress()
        const connection = await new ethers.providers.JsonRpcProvider(
            // "https://rpc-mumbai.maticvigil.com/"
            "https://matic-mumbai.chainstacklabs.com"
        );
        const twoAccounts = await getTwoAccounts(mnemonic)
        const firstAddress = await connection.getBalance(twoAccounts[0].address)
        const secondAddress = await connection.getBalance(twoAccounts[1].address)

        return {
            privateKey:{first: twoAccounts[0].privateKey, second: twoAccounts[1].privateKey},
            accountAddress: { first: twoAccounts[0].address, second: twoAccounts[1].address },
            balance: { first: ethers.utils.formatEther(firstAddress), second: ethers.utils.formatEther(secondAddress) }
        }
    } catch (err) {
        alert(err?.message)
    }
}


const getTwoAccounts = (mnemonic) => {
    const hdNode = utils.HDNode.fromMnemonic(mnemonic);
    const FirstAccount = hdNode.derivePath(`m/44'/60'/0'/0/0`);
    const secondAccount = hdNode.derivePath(`m/44'/60'/0'/0/1`);
    return [FirstAccount, secondAccount]
}

export { getAccountDetails }