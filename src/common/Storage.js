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
export const saveUserName=async(data)=>{
    console.log('Save',data)
    await AsyncStorage.setItem('USER_NAME', JSON.stringify(data), (err)=> {
        if(err){
            console.log("an error");
            throw err;
        }
        console.log("success");
    }).catch((err)=> {
        console.log("error is: " + err);
    });
}
export const getUserId=async()=>{
    try {
        const value = await AsyncStorage.getItem('USER_DATA');
        if (value !== null) {
            // We have data!!
            console.log(JSON.parse(value));
            console.log('User',data)
            const data=JSON.parse(value)
            return data['userDto']['userAccountId']
        }
    } catch (error) {
        return null;
        // Error retrieving data
    }
}
export const getUserName=async()=>{
    try {
        const value = await AsyncStorage.getItem('USER_NAME');
        if (value !== null) {
            // We have data!!
//            console.log(value);
            console.log('User',value)
            //const data=JSON.parse(value)
            return JSON.parse(value)
        }
    } catch (error) {
        return null;
        // Error retrieving data
    }
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