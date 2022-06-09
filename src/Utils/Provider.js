import { useDispatch } from "react-redux";
import { setProvider } from "../store/Actions/action";
import { ethers } from "ethers";

export const walletProvider = () => {
    const provider = new ethers.providers.JsonRpcProvider(
        // 'https://rinkeby.infura.io/v3/d02fb37024ef430b8f15fdacf9134ccc'
        "https://matic-mumbai.chainstacklabs.com"
    );
    // console.log('provider', provider)
    return provider
}
