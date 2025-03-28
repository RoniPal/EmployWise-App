import {ActivityIndicator, Alert, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Pressable, TextInput} from 'react-native-gesture-handler';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome5';

const Login = ({navigation}) => {
  //Variables
  const [email, setemail] = useState(''); //Email Store
  const [password, setpassword] = useState(''); //Password Store
  const [loading, setLoading] = useState(false); //Login btn disable & enable
  const [isCheckingLogin, setIsCheckingLogin] = useState(true); // State to check login status
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility

  //Recheck If Already Logged In
  useEffect(() => {
    const checkLoginStatus = async () => {
      const storeUser = await AsyncStorage.getItem('user'); //get data from storage
      if (storeUser) {
        navigation.replace('Listing'); //go to listing page if storeUser=true
      }
      setIsCheckingLogin(false); // Stop showing blank screen
    };
    checkLoginStatus(); //call the function
  }, []);

  //Text small letters
  const smallConvert = text => {
    setemail(text.toLowerCase()); //convert and store in email variable
  };

  //Login Button
  const handleLogin = async () => {
    //validation check
    if (!email || !password) {
      Alert.alert('Validation Error', 'Please Fill Up Email and Password Both');
      return;
    }

    //Loading true to disable login btn
    setLoading(true);

    //POST method to check login details
    try {
      const response = await axios.post('https://reqres.in/api/login', {
        email: email,
        password: password,
      }); //Login Details Send to server
      const token = response.data.token; //store token to variable
      await AsyncStorage.setItem('user', token); //Set user=token in loccl storage
      await AsyncStorage.setItem('userEmail', email); //Set user email in loccl storage
      Alert.alert('Success', 'Login Successful');
      navigation.replace('Listing'); //transfer to Listing page
    } catch (error) {
      Alert.alert('Login Failed', 'Invalid credentials. Try again!');
      //console.log(error);
    }

    //Loading false to enable login btn
    setLoading(false);
  };

  //If already login , then hide the Login page for a fraction of time when Async function work...
  if (isCheckingLogin) {
    return (
      <SafeAreaView
        style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        {/* Loading animation  */}
        <ActivityIndicator size="large" color="gray" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Heading */}
      <Text style={styles.heading}>Login</Text>

      {/* Form */}
      <View style={styles.loginContainer}>
        {/* Email Section */}
        <Text style={styles.inputHead}>Email :</Text>
        <TextInput
          value={email}
          onChangeText={smallConvert}
          keyboardType="email"
          style={styles.inputBox}
        />

        {/* Password Section */}
        <Text style={styles.inputHead}>Password :</Text>
        <View style={{flexDirection:"row"}}>
        <TextInput
          value={password}
          onChangeText={setpassword}
          secureTextEntry={showPassword}  //Password Show And Hide
          style={[styles.inputBox,{width:"90%"}]}
        />
        <Pressable
          onPress={() => setShowPassword(!showPassword)}
          style={{justifyContent:"center",alignItems:"center"}}>
          <Icon name= {showPassword ? 'eye' : 'eye-slash'} size={20} color="black" />
        </Pressable>
        </View>
      </View>

      {/* BTN */}
      <View style={styles.btnBox}>
        <Pressable style={styles.btn} onPress={handleLogin} disabled={loading}>
          <Text style={styles.btnText}>
            {loading ? 'Logging in...' : 'Login'}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 10,
    backgroundColor: '#dadada',
    //justifyContent:"center",
    //alignItems:"center",
  },
  heading: {
    fontSize: 30,
    fontWeight: 900,
    textAlign: 'center',
    marginBottom: 20,
  },
  loginContainer: {
    justifyContent: 'center',
    //alignItems:"center",
    gap: 10,
    paddingHorizontal: 20,
  },
  inputHead: {
    fontSize: 20,
    fontWeight: 800,
  },
  inputBox: {
    borderBottomWidth: 2,
    borderBottomColor: 'black',
    paddingHorizontal: 20,
    fontSize: 18,
    fontWeight: 500,
   // backgroundColor:"blue"
  },
  btnBox: {
    flexDirection: 'row',
    // gap:50,
    // height:70,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  btn: {
    backgroundColor: 'red',
    width: 110,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 7,
    backgroundColor: '#05a300',
  },
  btnText: {
    fontWeight: 900,
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
  },
});
