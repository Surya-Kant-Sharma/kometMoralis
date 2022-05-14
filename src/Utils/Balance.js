import { ethers } from "ethers";

export const eoa2Balance = (provider, address)=> {
    let lastBalance = ethers.constants.Zero

    console.log("last Balance" + lastBalance, address);
    provider.on('block', () => {
        provider.getBalance(address).then((balance) => {
            if (!balance.eq(lastBalance)) {
                lastBalance = balance
                // convert a currency unit from wei to ether
                const balanceInEth = ethers.utils.formatEther(balance)
                console.log(`balance: ${balanceInEth} ETH`)
            }
        })
    })
}