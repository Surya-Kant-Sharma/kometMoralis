import Clipboard from "@react-native-community/clipboard"
import { ToastAndroid } from "react-native";

export const copyToClipboard=(text)=>{
    Clipboard.setString(text);
    ToastAndroid.showWithGravity('Copied to Clipboard',ToastAndroid.SHORT,ToastAndroid.BOTTOM)
}