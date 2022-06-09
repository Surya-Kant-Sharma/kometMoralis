import Snackbar from "react-native-snackbar"
export const CustomSnackbar = (type, Msg) => {
    switch (type) {
        case "Success": successBar(Msg)
        case "failure": FailureBar(Msg)
    }
}

const successBar = (Msg) => {
    Snackbar.show({
        text: Msg,
        duration: Snackbar.LENGTH_LONG,
        backgroundColor : 'green',
        textColor : 'white'
    })
}
const FailureBar = (Msg) => {
    Snackbar.show({
        text: Msg,
        duration: Snackbar.LENGTH_LONG,
        backgroundColor : 'red',
        textColor : 'white'
    })
}