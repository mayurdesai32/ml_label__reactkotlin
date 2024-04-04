import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import ImageLabeling from '@react-native-ml-kit/image-labeling';
const Camera = () => {

    const options={
	selectionLimit: 1,
		mediaType: 'photo',
		includeBase64: true
    };
const options1={
    // saveToPhotos:1,
    cameraType:"front",
    	mediaType: 'photo',
		includeBase64: true
}
    useEffect(()=>{
        imageGallery()
    })
    const imageGallery=async()=>{
        // const result = await launchImageLibrary(options);
        const result = await launchCamera(options1);
        console.log(result.assets[0].uri);
        const labels = await ImageLabeling.label(result.assets[0].uri);
             console.log(labels);
    }

  return (
    <View>
      <Text>Camera</Text>
    </View>
  )
}

export default Camera