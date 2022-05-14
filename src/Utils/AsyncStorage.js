import AsyncStorage from "@react-native-async-storage/async-storage";

export const getAccountInfo = async () => {
    try {
        const response = await AsyncStorage.getItem('AccountsInfo')
            .catch(err => {
                console.log(err)
            });
        const value = JSON.parse(response);
        return value
    } catch (err) {
        console.log(err)
    }
}

export const setAccountInfo = async (data) => {
    try {
        await AsyncStorage.setItem('AccountsInfo', JSON.stringify(data))
            .catch(err => {
                console.log(err)
            });
    } catch (err) {
        console.log(err)
    }
}

export const setDataLocally = async (TYPE, data) => {
    try {
        await AsyncStorage.setItem(TYPE, JSON.stringify(data))
            .catch(err => {
                console.log(err)
            });
    } catch (err) {
        console.log(err)
    }
}
export const getDataLocally = async(TYPE) => {
    try {
        const response = await AsyncStorage.getItem(TYPE)
            .catch(err => {
                console.log(err)
            });
        const value = JSON.parse(response);
        return value
    } catch (err) {
        console.log(err)
    }
}

export const clearAllData = async () => {
    try {
        await AsyncStorage.clear().catch(err => {
            console.log(err)
        });
    } catch (err) {
        console.log(err)
    }
}

export const setBookmarks = async (data) => {
    try {
        await AsyncStorage.setItem('bookmarks', JSON.stringify(data))
            .catch((err) => {
                console.log(err)
            })
        return true;
    } catch (err) {
        console.log(err)
    }
}

export const getBookmarks = async () => {
    try {
        const response = await AsyncStorage.getItem('bookmarks')
            .catch(err => {
                console.log(err)
            });
        const value = JSON.parse(response);
        return value
    } catch (err) {
        console.log(err)
    }
}