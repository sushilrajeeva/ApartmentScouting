//took reference from lab6'
//use users.js to complete this
import {Router} from 'express';
import {ObjectId} from 'mongodb';
import {scoutUsers} from '../config/mongoCollections.js'
import { listings } from '../config/mongoCollections.js';
import helpers from '../helpers.js'

import bcrypt from 'bcryptjs';

const saltRounds = 12;

const router = Router();

export const createUser = async (
    firstName, 
    middleName, 
    lastName, 
    emailAddress, 
    countryCode, 
    phoneNumber, 
    city, 
    state, 
    country, 
    dob, 
    password, 
    confirmPassword, 
    userType
) => {

  console.log("Create scout User function is called!!");
  console.log({firstName: firstName, middleName: middleName, lastName: lastName, emailAddress: emailAddress, countryCode: countryCode, phoneNumber: phoneNumber, city: city, state: state, country: country, dob: dob, password: password, confirmPassword: confirmPassword, userType: userType});
  let codeCountry = "";
  //console.log("ScoutUSers: Create User function is called!!");
  //check if inputs are empty or not
  
  try {

    firstName = helpers.checkEmptyInputString(firstName,"First Name");
    // middleName = helpers.checkEmptyInputString(middleName,"First Name");
    lastName = helpers.checkEmptyInputString(lastName,"First Name");
    emailAddress = helpers.checkEmptyInputString(emailAddress,"Email Address");
    emailAddress = emailAddress.toLowerCase();
    countryCode = helpers.checkEmptyInputString(countryCode, "Country Code");
    countryCode = countryCode.trim();
    phoneNumber = helpers.checkEmptyInputString(phoneNumber, "Phone Number");
    city = helpers.checkEmptyInputString(city, "City");
    state = helpers.checkEmptyInputString(state, "State");
    country = helpers.checkEmptyInputString(country, "Country");
    country = helpers.checkEmptyInputString(country, "Country Code");
    country = country.trim();
    userType = helpers.checkEmptyInputString(userType, "User Type");
    userType = userType.trim();
    dob = helpers.checkEmptyInputString(dob);
    helpers.checkEmptyInputString(password, "Password")
      //confirmPassword = checkEmptyInputString(confirmPassword,"Confirm Password");
    helpers.checkEmptyInputString(confirmPassword,"Confirm Password");
    helpers.countryCodeExists(countryCode);
    codeCountry = helpers.findCountry(countryCode);
    helpers.validPhoneNumber(phoneNumber)
    helpers.validCountrySelected(country, codeCountry, countryCode);

    helpers.checkNameInput(firstName, "Name");

    helpers.checkValidEmail(emailAddress);

    helpers.checkValidAge(dob)

    helpers.checkValidPassword(password);

    helpers.checkPasswordsMatch(password, confirmPassword);

    helpers.checkValiduserType(userType);

    if(userType.toLowerCase() !== "scout user"){
        throw `Error: Primary User is not selected`    
    }
    
 
    //checking if this valid email id is already a user or not in our db
    const usersCollection = await scoutUsers();
    const user = await usersCollection.findOne({emailAddress});

    if(user){
      throw `The email address - ${emailAddress} that you used to register as primary user, already exist! please recheck your email and try registering, or else try loggin in if you already have an account as a primary user!`
    }

    //Used professor's lecture code for password hashing
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    //since everything went well and nothing blew up !!so i will push it to the db

    let scoutUserData = {
      _id: new ObjectId(),
      firstName: firstName, 
      middleName: middleName, 
      lastName: lastName, 
      emailAddress: emailAddress, 
      countryCode: countryCode, 
      phoneNumber: phoneNumber, 
      city: city, 
      state: state, 
      country: country, 
      dob: dob,
      role: userType,
      password: hashedPassword,
      subscribedlistings: [],
      wallet: 1000
    }

    const insertInfo = await usersCollection.insertOne(scoutUserData);

    if (!insertInfo.acknowledged || !insertInfo.insertedId){
      throw 'Could not add user';
    }

    return {insertedUser: true};


  } catch (error) {
    throw error;
  }

};

export const checkUser = async (emailAddress, password) => {

  console.log("Scout Users check user method is called!");
  
  try {

    emailAddress = helpers.checkEmptyInputString(emailAddress, "Email Address");
    emailAddress.toLowerCase();
    helpers.checkEmptyInputString(password, "Password");

    helpers.checkValidEmail(emailAddress);
    helpers.checkValidPassword(password);

    //since nothing blew up till here, let's query the db to check if an user collection with given email is present or not

    const usersCollection = await scoutUsers();
    const user = await usersCollection.findOne({emailAddress});

    if(!user){
      throw `Either the email address or password is invalid`
    }

    //took the code from professor's lecture code
    let compareToMatch = await bcrypt.compare(password, user.password);

    if (compareToMatch) {
      console.log('The passwords match.. this is good');
      return {_id: user._id.toString(), firstName: user.firstName, middleName: user.middleName, lastName: user.lastName, emailAddress: user.emailAddress, countryCode: user.countryCode, phoneNumber: user.phoneNumber, city: user.city, state: user.state, country: user.country, dob: user.dob, listings: user.listings, wallet: user.wallet, role: user.role}
    } else {
      //console.log('The passwords do not match, this is not good, they should match');
      throw `Either the email address or password is invalid`
    }

    //return {firstName: user.firstName, lastName: user.lastName, emailAddress: user.emailAddress, role: user.role}

  } catch (error) {
    throw error;
  }
};

export const getAllListings = async () => {

    console.log(" getAllListings method is called!");
    
    try {
  
        const listingsCollection = await listings();
        console.log("Hi");
        const allListings = await listingsCollection.find({}).toArray();
        console.log("ohh");

        return allListings;
      
  
  
    } catch (error) {
      throw error;
    }
  };

  export const searchListings = async (searchKey) => {

    console.log(" Search Key method is called! and our search key is -> ", searchKey);
    
    try {
  
        const listingsCollection = await listings();
        //This code let's users to search listings based on the following parameters - city, state, country and pincode
        //Reffered -> https://www.mongodb.com/docs/manual/reference/operator/query/or/ to do search using the $or keyword
        //Reffered -> https://www.mongodb.com/docs/manual/reference/operator/query/regex/ to do search using the $regex pattern
        const searchedListings = await listingsCollection.find({
            $or: [
              { street: { $regex: searchKey, $options: 'i' } },
              { city: { $regex: searchKey, $options: 'i' } },
              { state: { $regex: searchKey, $options: 'i' } },
              { country: { $regex: searchKey, $options: 'i' } },
              { pincode: { $regex: searchKey, $options: 'i' } }
            ],
          }).toArray()

        return searchedListings;
      
  
  
    } catch (error) {
      throw error;
    }
  };

  export const viewListings = async (
    ) =>{

    console.log("View Listings Data is triggered!");
    try {
        const listingCollection = await listings();
        const userListings = await listingCollection.find({}).toArray();

        if(!userListings){
            return []
        }else {
            return userListings;
        }

    } catch (error) {
        throw error;
    }
};

export const getWalletBalance = async (userID) =>{

  //Added wallet functionality. This functionality allows primary user to fetch his/her wallet balance

console.log("Get Wallet Balance Data is triggered!");
try {

  helpers.isValidObjectID(userID, "User ID");

  let userIDObj = new ObjectId(userID);

  console.log("User ID -> ", userIDObj.toString());

  const usersCollection = await scoutUsers();
  const user = await usersCollection.findOne({ _id: userIDObj });

  if(!user){
      throw `Your Session has expired! Please try logging in again!!`
  }

  let walletBalance = user.wallet;

  return walletBalance;

} catch (error) {
  throw error;
}
}

//confirm with TAs if this additional code is required since we are already exporting functions individually
export default {createUser,checkUser,getAllListings,searchListings, viewListings, getWalletBalance}