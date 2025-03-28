import {View, Text} from 'react-native';
import React, {useEffect, useState} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {NavigationContainer} from '@react-navigation/native';
import Login from './src_pages/Login';
import Listing from './src_pages/Listing';

//create new stack navigation
const Stack = createStackNavigator();

//Main App
const App = () => {
  //Navigation Stack Create...
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login" //Intialy open Login Page
        screenOptions={{headerShown: false}} //Header Hide
      >
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Listing" component={Listing} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;

//No Styling...
