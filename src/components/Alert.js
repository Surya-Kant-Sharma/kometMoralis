import { Alert } from 'react-native'

const AlertConfirm = (title, message, success, dismiss) => {
    Alert.alert(
        title,
        message,
        [
            {
                text: 'Go To Polygon Faucet',
                onPress: () => success(),
                style: 'ok'
            },
            {
                text: 'cancel',
                onDismiss: () => dismiss(),
                style: 'cancel'
            }

        ]
    );
}

const AlertCustomDialog = (title, message, okBtnText, cancelBtnText, success, dismiss) => {
    Alert.alert(
        title,
        message,
        [
            {
                text: okBtnText,
                onPress: () => success(),
                style: 'ok'
            },
            {
                text: cancelBtnText,
                onDismiss: () => dismiss(),
                style: 'cancel'
            }

        ]
    );
}

export default AlertConfirm
export { AlertCustomDialog }