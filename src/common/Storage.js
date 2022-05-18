import AsyncStorage from "@react-native-async-storage/async-storage"

export const saveUserData=async(responseData)=>{
    await AsyncStorage.setItem('USER_DATA', JSON.stringify(responseData), (err)=> {
        if(err){
            console.log("an error");
            throw err;
        }
        console.log("success");
    }).catch((err)=> {
        console.log("error is: " + err);
    });
}

export const getToken=async()=>{
    try {
        const value = await AsyncStorage.getItem('USER_DATA');
        if (value !== null) {
            // We have data!!
            console.log(JSON.parse(value));
            return JSON.parse(value)
        }
    } catch (error) {
        return null;
        // Error retrieving data
    }
}