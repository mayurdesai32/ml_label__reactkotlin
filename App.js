/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState} from 'react';

import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  ImageBackground,
  Dimensions,
  TouchableOpacity,
  Image,
} from 'react-native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import ImageLabeling from '@react-native-ml-kit/image-labeling';
import Toast from 'react-native-toast-message';
const {width, height} = Dimensions.get('window');
const App = () => {
  let landscape = height < width;
  console.log('landscape', landscape);
  const [selectImage, setSelectImage] = useState(null);
  const [result, setResult] = useState(null);

  const gallaryOptions = {
    selectionLimit: 1,
    mediaType: 'photo',
    includeBase64: true,
  };
  const CameraOptions = {
    // saveToPhotos:1,
    cameraType: 'front',
    mediaType: 'photo',
    includeBase64: true,
  };

  const backgroundStyle = {
    // flex: 1,
    // backgroundColor: 'red',
  };
  const onPressHandler = async selectOption => {
    try {
      let tempresult;
      if (selectOption === 'camera') {
        tempresult = await launchCamera(CameraOptions);
      } else {
        tempresult = await launchImageLibrary(gallaryOptions);
      }
      setSelectImage(tempresult.assets[0].uri);
      const labels = await ImageLabeling.label(tempresult.assets[0].uri);
      setResult(labels);
      console.log(labels);
    } catch (error) {
      console.log(error);
      showToast('Something Went Wrong');
    }
  };

  const showToast = text => {
    Toast.show({
      type: 'error',
      text1: text,
      text2: 'Please Try Again Later',
    });
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <ImageBackground
        source={require('./assert/brick1.jpg')}
        resizeMode="cover"
        style={styles.imageBg}
      />
      <StatusBar barStyle={'light-content'} backgroundColor={'black'} />

      <View style={styles.container}>
        {/* <Image style={styles.frame} source={} /> */}
        <Image
          style={styles.frame}
          source={
            selectImage ? {uri: selectImage} : require('./assert/empty.jpg')
          }
        />
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            marginTop: 30,
            marginBottom: 18,
          }}>
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.btn}
            onPress={() => onPressHandler('gallery')}>
            <Text
              style={{
                textAlign: 'center',
                color: '#fff',
                fontSize: 20,
              }}>
              Gallery
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.btn}
            onPress={() => onPressHandler('camera')}>
            <Text
              style={{
                textAlign: 'center',
                color: '#fff',
                fontSize: 20,
              }}>
              Camera
            </Text>
          </TouchableOpacity>
        </View>

        {result ? (
          <>
            <View>
              <Text
                style={{
                  textAlign: 'center',
                  color: '#fff',
                  fontSize: 30,
                  fontWeight: '900',
                }}>
                Predicted Result
              </Text>
            </View>
            <ScrollView vertical={true} style={styles.scrollView}>
              {result
                .filter(e => e.confidence > 0.5)
                .map((e, i) => (
                  <View
                    key={i}
                    style={{
                      flexDirection: 'row',
                      paddingLeft: 2,
                      borderWidth: 1,
                      borderColor: 'white',
                      // justifyContent: 'space-between',
                      paddingRight: 15,
                    }}>
                    <Text style={styles.resultText}>{i + 1}</Text>
                    <Text
                      style={[styles.resultText, {textTransform: 'uppercase'}]}>
                      {e.text}
                    </Text>
                    <Text
                      style={[
                        styles.resultText,
                        {
                          textAlign: 'right',
                          backgroundColor: 'red',
                          marginLeft: 'auto',
                        },
                      ]}>
                      Cf: {e.confidence.toFixed(3)}%
                    </Text>
                  </View>
                ))}
            </ScrollView>
          </>
        ) : (
          <View
            style={{
              color: 'white',
              justifyContent: 'center',
              alignSelf: 'center',

              flex: 1,
            }}>
            <Text
              style={{
                color: 'white',
                // justifySelf: 'center',
                // alignSelf: 'center',
                fontSize: 30,
                fontWeight: '700',
                textAlign: 'center',
              }}>
              Please upload the image
            </Text>
          </View>
        )}
        <Toast />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
  },
  imageBg: {
    position: 'absolute',
    justifyContent: 'center',
    zIndex: 0,
    width: '100%',
    height: '100%',
  },
  frame: {
    width: 300,
    height: 250,
    backgroundColor: 'red',
    borderWidth: 12,
    borderRadius: 15,
    borderColor: 'green',
    marginTop: 35,
    alignSelf: 'center',
  },
  btn: {
    paddingHorizontal: 18,
    paddingVertical: 13,
    borderRadius: 15,
    backgroundColor: 'orange',
    justifyContent: 'center',
    alignItem: 'center',
  },
  scrollView: {
    marginVertical: 20,
    backgroundColor: 'black',
    width: width - 30,
    borderWidth: 1,
    borderColor: 'white',
  },
  resultText: {
    color: 'white',
    fontSize: 20,
    marginTop: 20,
    paddingLeft: 20,
  },
});

export default App;
