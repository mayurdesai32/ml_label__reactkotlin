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
  View,
  TouchableOpacity,
  Image,
} from 'react-native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import ImageLabeling from '@react-native-ml-kit/image-labeling';
import Toast from 'react-native-toast-message';

import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';

const App = () => {
  // let landscape = height < width;
  // console.log('landscape', landscape);
  const [selectImage, setSelectImage] = useState(null);
  const [result, setResult] = useState(null);
  const [splash, setSplash] = useState(true);

  const onPressHandler = async type => {
    console.log(type);
    try {
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

      if (type === 'CAMERA') {
        tempresult = await launchCamera(CameraOptions);
      } else if (type === 'IMAGEGALLERY') {
        tempresult = await launchImageLibrary(gallaryOptions);
      }

      if (tempresult) {
        setSelectImage(tempresult.assets[0].uri);
        const labels = await ImageLabeling.label(tempresult.assets[0].uri);
        console.log(labels);
        setResult(labels);
      }
    } catch (error) {
      console.log(error);
      showToast('Something Went Wrong');
    }
  };

  const showToast = text => {
    Toast.show({
      type: 'error',
      text1: text,
      // text2: 'Please Try Again Later',
    });
  };

  useEffect(() => {
    setTimeout(() => {
      setSplash(false);
    }, 900);
  }, []);
  return (
    <SafeAreaView style={styles.backgroundStyle}>
      <StatusBar barStyle={'light-content'} backgroundColor={'black'} />
      {splash ? (
        <View style={styles.splash}>
          <Image
            style={styles.splashImg}
            source={
              selectImage ? {uri: selectImage} : require('./assert/empty1.png')
            }
            resizeMode="contain"
          />
          <View style={{borderWidth: 7, borderColor: 'red'}}>
            <Text style={styles.splashText}>MD IMAGE LABEL</Text>
          </View>
        </View>
      ) : (
        <View style={styles.container}>
          <View>
            <Text
              style={{
                color: 'white',
                textAlign: 'center',
                fontSize: responsiveFontSize(4.5),
                fontWeight: '800',
                marginTop: responsiveHeight(3.5),
              }}>
              MD IMAGE LABEL
            </Text>
          </View>

          <View style={styles.frame}>
            <Image
              style={styles.frameImage}
              source={
                selectImage
                  ? {uri: selectImage}
                  : require('./assert/empty1.png')
              }
              resizeMode="contain"
            />
          </View>
          <View style={styles.btnContainer}>
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.btn}
              onPress={() => onPressHandler('IMAGEGALLERY')}>
              <Text style={styles.btnText}>Gallery</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.btn}
              onPress={() => onPressHandler('CAMERA')}>
              <Text style={styles.btnText}>Camera</Text>
            </TouchableOpacity>
          </View>

          {result ? (
            result.length === 0 ? (
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  flex: 1,
                }}>
                <Text
                  style={[
                    styles.resultText,
                    {
                      textTransform: 'uppercase',
                      fontSize: responsiveFontSize(3),
                      fontWeight: '700',
                    },
                  ]}>
                  Cant detect object
                </Text>
              </View>
            ) : (
              <>
                <View>
                  <Text
                    style={{
                      // marginTop: responsiveHeight(2),
                      textAlign: 'center',
                      color: '#fff',
                      fontSize: responsiveFontSize(4),
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
                          borderBottomWidth: 1,
                          borderColor: 'white',
                          paddingRight: responsiveWidth(1.5),
                          alignContent: 'center',
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
                              marginLeft: 'auto',
                            },
                          ]}>
                          Cf: {(e.confidence * 100).toFixed(2)}%
                        </Text>
                      </View>
                    ))}
                </ScrollView>
              </>
            )
          ) : (
            <View
              style={{
                color: 'white',
                alignSelf: 'center',
                justifyContent: 'center',
                flex: 1,
              }}>
              <Text
                style={{
                  color: 'white',
                  fontSize: responsiveFontSize(5),
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
  backgroundStyle: {
    backgroundColor: 'black',
  },

  splash: {
    // flex: 1,
    width: responsiveWidth(100),
    height: responsiveHeight(100),
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: responsiveWidth(5),
  },

  splashImg: {
    marginTop: responsiveHeight(-12),
    height: responsiveWidth(45),
    width: responsiveWidth(50),
    borderRadius: responsiveWidth(5),
    marginBottom: responsiveHeight(4),
    alignSelf: 'center',
  },
  splashText: {
    // flex: 1,
    alignSelf: 'center',
    paddingHorizontal: responsiveWidth(7),
    paddingVertical: responsiveHeight(2),
    color: 'red',
    fontSize: responsiveFontSize(3.7),
    fontWeight: '700',
    textAlign: 'center',
  },

  container: {
    width: '100%',
    height: '100%',
    alignSelf: 'center',
  },

  imageBg: {
    position: 'absolute',
    justifyContent: 'center',
    zIndex: 0,
    width: responsiveWidth(100),
    height: responsiveHeight(100),
  },
  frame: {
    // width: 300,
    // height: 250,
    backgroundColor: 'black',
    borderWidth: 6,
    borderRadius: responsiveWidth(6),
    borderColor: 'white',
    marginTop: responsiveHeight(3.5),
    alignSelf: 'center',
    // paddingVertical: 300,
    borderStyle: 'dashed',
  },

  frameImage: {
    borderWidth: 6,
    borderRadius: responsiveWidth(6),
    width: responsiveWidth(64),
    height: responsiveHeight(26),
    margin: responsiveHeight(2.8),
  },

  btnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: responsiveHeight(4),
    marginBottom: responsiveHeight(2.5),
    paddingHorizontal: responsiveWidth(7),
  },
  btn: {
    paddingHorizontal: responsiveWidth(9),
    paddingVertical: responsiveHeight(1.7),
    borderRadius: responsiveWidth(4),
    backgroundColor: 'orange',
    justifyContent: 'center',
    alignItem: 'center',
  },
  btnText: {
    textAlign: 'center',
    color: 'black',
    fontSize: responsiveFontSize(3.2),
    fontWeight: '700',
  },

  scrollView: {
    overFlow: 'hidden',
    marginVertical: responsiveHeight(2),
    backgroundColor: 'black',
    width: responsiveWidth(90),
    borderWidth: 3,
    borderColor: 'white',
    borderStyle: 'dotted',
    borderRadius: responsiveWidth(2),
    alignSelf: 'center',
  },
  resultText: {
    color: 'white',
    fontSize: responsiveFontSize(2.5),
    marginVertical: responsiveHeight(1.8),
    paddingLeft: responsiveWidth(3.8),
  },
});

export default App;
