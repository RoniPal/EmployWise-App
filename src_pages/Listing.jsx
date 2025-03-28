import {
  Alert,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {FlatList, TextInput} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome5';

const Listing = ({navigation}) => {
  //Variables
  const [users, setusers] = useState([]); //store users
  const [page, setpage] = useState(1); //Pagination control
  const [email, setEmail] = useState('Unkown'); //Admin Email
  const [modalVisible, setModalVisible] = useState(false); //Modal Show Or Hide
  const [selectedUser, setSelectedUser] = useState(null); // User being edited
  const [userNone, setuserNone] = useState(false); //Custom index page

  //All Function Calls
  useEffect(() => {
    getEmailAdmin();
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [page]);

  //Get Admin Email Function
  const getEmailAdmin = async () => {
    const userEmail = await AsyncStorage.getItem('userEmail'); //Get data from Storage
    setEmail(userEmail || 'Unknown');
  };

  //Logout btn Function
  const handleLogout = async () => {
    await AsyncStorage.removeItem('user'); //Remove user token
    navigation.replace('Login'); // go to login page
  };

  //User Data get Function
  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        `https://reqres.in/api/users?page=${page}`, //request to the server
      );
      if (response.data.data.length == 0) {
        //When it's 0 the list has no user
        setuserNone(true); //For when the list end
      } else {
        setusers(response.data.data);
        setuserNone(false); //For When The List Not End
      }
      //console.log(response.data.data)
    } catch (error) {
      Alert.alert('Error', 'Users Data Failed To Fetch');
      //console.log(error);
    }
  };

  //Delete User function
  const handleDelete = async userId => {
    try {
      const response = await axios.delete(
        `https://reqres.in/api/users/${userId}`, //Delete Request
      );
      setusers(users.filter(user => user.id !== userId)); //Delete data from current user array also
      Alert.alert(
        'User Removed',
        `User Id : ${userId}, Status : ${response.status}`, //Getting Status to confirm Deletion
      );
      //console.log(response)
    } catch (error) {
      Alert.alert('Error', 'Failed to delete user.');
      //console.log(error)
    }
  };

  // Open Edit Modal form
  const handleEdit = user => {
    setSelectedUser(user); // Set user data in state
    setModalVisible(true); // Show modal
  };

  // Update User Function
  const handleUpdate = async () => {
    // Validation Check
    if (
      !selectedUser ||
      !selectedUser.first_name ||
      !selectedUser.last_name ||
      !selectedUser.email
    ) {
      Alert.alert('Validation Error', 'Please Fill Up Every Section');
      return;
    }

    //PUT request
    try {
      const response = await axios.put(
        `https://reqres.in/api/users/${selectedUser.id}`,
        {
          first_name: selectedUser.first_name, //First name update
          last_name: selectedUser.last_name, //Last name update
          email: selectedUser.email, //Email Update
        },
      );

      // Update users array locally also
      setusers(
        users.map(user => (user.id === selectedUser.id ? selectedUser : user)),
      );

      setModalVisible(false); // Close modal View
      Alert.alert('User Updated', `Updated At: ${response.data.updatedAt}`); //Update Time to confirm sussessful update
      //console.log(response);
    } catch (error) {
      Alert.alert('Error', 'Failed to update user.');
      //console.log(error)
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* LogOut Section */}
      <View style={styles.logOutContainer}>
        <Text style={styles.adminEmail}>{email}</Text>
        <Pressable style={styles.btnLO} onPress={handleLogout}>
          <Text style={styles.textLO}>Log Out</Text>
        </Pressable>
      </View>

      {userNone ? (
        //If no User Or End List Then This Shows
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text style={{textAlign: 'center', fontSize: 35, fontWeight: 900}}>
            No User Found!
          </Text>
          <Text style={{textAlign: 'center', fontSize: 20, fontWeight: 400}}>
            End of List
          </Text>
        </View>
      ) : (
        //If Data Of Users Are Available It's shows then
        <FlatList
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          data={users}
          keyExtractor={item => item.id}
          renderItem={({item}) => (
            <View style={styles.listDetails}>
              {/* Image Section */}
              <Image source={{uri: item.avatar}} style={styles.listImage} />
              {/* Full Name And Email Section */}
              <View style={styles.textDetails}>
                <Text style={styles.listName}>{item.first_name}</Text>
                <Text style={styles.listName}>{item.last_name}</Text>
                <Text style={styles.listEmail}>{item.email}</Text>
              </View>
              {/* Button Section */}
              <View style={styles.listBtn}>
                {/* Edit Btn */}
                <Pressable
                  style={[
                    styles.deleteButton,
                    {backgroundColor: 'green', marginBottom: 10},
                  ]}
                  onPress={() => handleEdit(item)}>
                  <Icon name="pen" size={15} color="white" />
                </Pressable>
                {/* Delete Btn */}
                <Pressable
                  style={styles.deleteButton}
                  onPress={() => handleDelete(item.id)}>
                  <Icon name="trash" size={15} color="white" />
                </Pressable>
              </View>
            </View>
          )}
        />
      )}

      {/* Modal Start */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {/* Heading */}
            <Text style={styles.modalTitle}>Edit User</Text>

            {/* Form Start */}
            <TextInput
              style={styles.input}
              placeholder="First Name"
              value={selectedUser?.first_name}
              onChangeText={text =>
                setSelectedUser({...selectedUser, first_name: text})
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Last Name"
              value={selectedUser?.last_name}
              onChangeText={text =>
                setSelectedUser({...selectedUser, last_name: text})
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={selectedUser?.email}
              onChangeText={text =>
                setSelectedUser({...selectedUser, email: text})
              }
            />
            {/* Form End */}

            {/* Btn Section */}
            <View style={styles.modalButtons}>
              {/* Update btn */}
              <Pressable
                style={[styles.modalButton, {backgroundColor: 'green'}]}
                onPress={handleUpdate}>
                <Text style={styles.modalButtonText}>Update</Text>
              </Pressable>
              {/* Cancel btn */}
              <Pressable
                style={[styles.modalButton, {backgroundColor: 'red'}]}
                onPress={() => setModalVisible(false)}>
                <Text style={styles.modalButtonText}>Cancel</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
      {/* Modal End */}

      {/* Navigation */}
      <View style={styles.buttonContainer}>
        {/* previous */}
        <Pressable
          style={[
            styles.button,
            {backgroundColor: page === 1 ? '#7d4b4b' : '#757f8b'},
          ]}
          onPress={() => setpage(page - 1)}
          disabled={page === 1}>
          <Icon name="angle-double-left" size={25} color="white" />
        </Pressable>

        {/* page number */}
        <View style={styles.noUser}>
          <Text style={styles.noUserText}>{page}</Text>
        </View>

        {/* next */}
        <Pressable
          style={[
            styles.button,
            {backgroundColor: userNone ? '#7d4b4b' : '#757f8b'},
          ]}
          onPress={() => setpage(page + 1)}
          disabled={userNone}>
          <Icon name="angle-double-right" size={25} color="white" />
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default Listing;

const styles = StyleSheet.create({
  //Main Page Styling...
  container: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 10,
    gap: 10,
    backgroundColor: '#dadada',
    //justifyContent:"center",
    //alignItems:"center",
  },
  logOutContainer: {
    //paddingHorizontal:10,
    paddingVertical: 5,
    //backgroundColor:"green",
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: 10,
  },
  adminEmail: {
    fontSize: 16,
    fontWeight: 700,
    marginRight: 15,
    textAlign: 'right',
    color: 'green',
  },
  btnLO: {
    backgroundColor: 'red',
    width: 100,
    paddingVertical: 5,
    borderRadius: 10,
  },
  textLO: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 900,
    color: 'white',
  },
  listDetails: {
    backgroundColor: 'white',
    marginBottom: 15,
    padding: 10,
    borderWidth: 2,
    borderRadius: 15,
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    //backgroundColor:"skyblue",
    width: '65%',
  },
  listImage: {
    width: 60,
    height: 60,
    borderWidth: 2,
    borderColor: 'gray',
    borderRadius: 50,
    marginRight: 10,
  },
  listEmail: {
    fontWeight: 900,
    fontSize: 18,
    textAlign: 'left',
    width: '100%',
    color: 'gray',
    // backgroundColor:"red"
  },
  listName: {
    fontWeight: 900,
    fontSize: 20,
    marginRight: 5,
    marginBottom: 5,
    //backgroundColor:"blue"
  },
  listBtn: {
    //backgroundColor:"gray",
    marginLeft: 10,
  },
  deleteButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Modal Styling...
  modalContainer: {
    flex: 1,
    //justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingTop: 100,
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
  },
  modalButtonText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  //Navigation Styling...
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 15,
    marginBottom: 15,
    paddingHorizontal: 35,
    //backgroundColor:"blue",
    alignItems: 'center',
  },
  button: {
    borderRadius: 20,
    width: 50,
    height: 50,
    borderWidth: 3,
    borderColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noUser: {
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
    height: 50,
    borderRadius: 50,
  },
  noUserText: {
    fontWeight: 900,
    color: 'white',
    fontSize: 18,
  },
});
