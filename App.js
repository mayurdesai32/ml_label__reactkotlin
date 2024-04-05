/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useEffect, useState} from 'react';

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
  // let landscape = height < width;
  // console.log('landscape', landscape);
  const [selectImage, setSelectImage] = useState(null);
  const [result, setResult] = useState(null);
  const [splash, setSplash] = useState(true);
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

  useEffect(() => {
    setTimeout(() => {
      setSplash(false);
    }, 2000);
  }, []);
  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={'light-content'} backgroundColor={'black'} />

      <ImageBackground
        source={require('./assert/brick1.jpg')}
        resizeMode="cover"
        style={styles.imageBg}
      />

      {splash ? (
        <View style={styles.splash}>
          <Text style={styles.splashText}>MD IMAGE LABEL</Text>
        </View>
      ) : (
        <View style={styles.container}>
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
              marginTop: 35,
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
                        style={[
                          styles.resultText,
                          {textTransform: 'uppercase'},
                        ]}>
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
                        Cf: {(e.confidence * 100).toFixed(2)}%
                      </Text>
                    </View>
                  ))}
              </ScrollView>
            </>
          ) : (
            <View
              style={{
                color: 'white',
                alignSelf: 'center',
                flex: 1,
              }}>
              <Text
                style={{
                  color: 'white',
                  marginTop: 80,
                  fontSize: 38,
                  fontWeight: '700',
                  textAlign: 'center',
                }}>
                Please upload the image
              </Text>
            </View>
          )}
          <Toast />
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
  },

  splash: {
    // flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  splashText: {
    // flex: 1,
    alignSelf: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 28,
    paddingVertical: 20,
    paddingTop: 35,
    borderWidth: 8,
    borderColor: 'red',
    color: 'red',
    fontSize: 30,
    fontWeight: '700',
    textAlign: 'center',
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
    borderWidth: 4,
    borderRadius: 15,
    borderColor: 'black',
    marginTop: 35,
    alignSelf: 'center',
  },
  btn: {
    paddingHorizontal: 37,
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
