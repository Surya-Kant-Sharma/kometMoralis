import { View, Text } from 'react-native'
import React from 'react'
import GDrive from 'react-native-google-drive-api-wrapper';
import { GoogleSignin } from '@react-native-google-signin/google-signin';



const Drive = () => {
    const [loading, setLoading] = React.useState(false);
    
    const _initGoogleDrive = async () => {
        // Getting Access Token from Google
        let token = await GoogleSignin.getTokens();
        if (!token) return alert('Failed to get token');
        console.log('res.accessToken =>', token.accessToken);
        // Setting Access Token
        GDrive.setAccessToken(token.accessToken);
        // Initializing Google Drive and confirming permissions
        GDrive.init();
        // Check if Initialized
        return GDrive.isInitialized();
      };

      React.useEffect(()=>{
        _initGoogleDrive();
      },[])

    const _uploadDriveData = async () => {
        try {
          // Check if file selected
          setLoading(true);
          if (!(await _initGoogleDrive())) {
            return alert('Failed to Initialize Google Drive');
          }
          // Create Directory on Google Device
          let directoryId = await GDrive.files.safeCreateFolder({
            name: 'Komet',
            parents: ['root'],
          });
          console.log('directoryId -> ', directoryId);
          let fileName = new Date().getTime() + '.txt';
          // Check upload file response for success
          let result = await GDrive.files.createFileMultipart(
            'Hello World',
            'application/text',
            {
              parents: [directoryId],
              name: fileName,
            },
            false,
          );
          // Check upload file response for success
          if (!result.ok) return alert('Uploading Failed');
          // Getting the uploaded File Id
          let fileId = await GDrive.files.getId(
            fileName,
            [directoryId],
            'application/text',
            false,
          );
          setInputTextValue('');
          alert(`Uploaded Successfull. File Id: ${fileId}`);
        } catch (error) {
          console.log('Error->', JSON.stringify(error));
          alert(`Error-> ${error}`);
        }
        setLoading(false);
      };
  return (
    <View style={{alignSelf:'center',justifyContent:'center',alignItems:'center',flex:1}}>
      <Text style={{color:'white'}} onPress={()=>_uploadDriveData()}>Drive</Text>
    </View>
  )
}

export default Drive