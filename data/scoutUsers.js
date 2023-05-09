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
    helpers.validPhoneNumber(phoneNumber)
    helpers.validCountrySelected(country);

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

export const updateUser = async (
  userId,
  firstName,
  middleName,
  lastName,
  emailAddress,
  countryCode,
  phoneNumber,
  city,
  state,
  country,
  dob
) => {
  console.log("Update User function of scout is called!!");
  console.log({
    userId,
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
  });


  try {
    firstName = helpers.checkEmptyInputString(firstName, "First Name");
    lastName = helpers.checkEmptyInputString(lastName, "Last Name");
    emailAddress = helpers.checkEmptyInputString(emailAddress, "Email Address");
    emailAddress = emailAddress.toLowerCase();
    countryCode = helpers.checkEmptyInputString(countryCode, "Country Code");
    countryCode = countryCode.trim();
    phoneNumber = helpers.checkEmptyInputString(phoneNumber, "Phone Number");
    city = helpers.checkEmptyInputString(city, "City");
    state = helpers.checkEmptyInputString(state, "State");
    country = helpers.checkEmptyInputString(country, "Country");
    country = helpers.checkEmptyInputString(country, "Country Code");
    country = country.trim();
    dob = helpers.checkEmptyInputString(dob);

    helpers.countryCodeExists(countryCode);
    helpers.validPhoneNumber(phoneNumber);
    helpers.validCountrySelected(country);

    helpers.checkNameInput(firstName, "Name");

    helpers.checkValidEmail(emailAddress);

    helpers.checkValidAge(dob);

    const usersCollection = await scoutUsers();
    const user = await usersCollection.findOne({ _id: new ObjectId(userId) });

    if (!user) {
      throw `The Scout user with ID ${userId} does not exist!`;
    }

    const updatedUser = {
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
    };

    const updateInfo = await usersCollection.updateOne(
      { _id: new ObjectId(userId) },
      { $set: updatedUser },
      {returnDocument: 'after'}
    );

    if (!updateInfo.matchedCount || !updateInfo.modifiedCount) {
      throw "Could not update user";
    }

    const updatedUserInfo = await usersCollection.findOne({
      _id: new ObjectId(userId),
    });
    return {_id: updatedUserInfo._id.toString(), firstName: updatedUserInfo.firstName, middleName: updatedUserInfo.middleName, lastName: updatedUserInfo.lastName, emailAddress: updatedUserInfo.emailAddress, countryCode: updatedUserInfo.countryCode, phoneNumber: updatedUserInfo.phoneNumber, city: updatedUserInfo.city, state: updatedUserInfo.state, country: updatedUserInfo.country, dob: updatedUserInfo.dob, listings: updatedUserInfo.listings, wallet: updatedUserInfo.wallet, role: updatedUserInfo.role}

    return { updatedUser: true };
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

export const getAllListings = async (scoutID = null) => {

    console.log(" getAllListings method is called!");
    
    try {
  
        const listingsCollection = await listings();
        //Using this ogic to query those listings from the collection that has scoutID as null
        // this is because i don't want users to see listings on their homepage that are already subscribed
        const query =  { scoutID: null };
        const allListings = await listingsCollection.find(query).toArray();

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

//This function is used to subscribe to a listing that the scout user has clicked.
export const subscribe = async (listingID, userID) =>{

  console.log("subscribe Listings Data is triggered!");
  helpers.isValidObjectID(listingID, "Listing ID");
  helpers.isValidObjectID(userID, "Listing ID");
  let listingIDObj = new ObjectId(listingID)
  let userIDObj = new ObjectId(userID)
  try {
      const listingCollection = await listings();
      const userListing = await listingCollection.findOne({_id: listingIDObj});


      if(!userListing){
        console.log("No listing found!!");
          throw `The listing you are trying to subscribe doesn't exist!!`
      }else {
        console.log('Listing found!!');
          
      }

      const scoutUserCollection = await scoutUsers();
      //referred https://www.mongodb.com/docs/manual/reference/method/db.collection.updateOne/ for update one logic
      //reffered https://www.mongodb.com/docs/manual/reference/operator/update/addToSet/ for $addToSet logic
      const updatedScout = await scoutUserCollection.updateOne(
        { _id: userIDObj },
        {
          $addToSet: {
            subscribedlistings: {
              listingID: listingIDObj,
              active: true,
            },
          },
        }
      );

      //refered https://www.mongodb.com/docs/manual/reference/method/db.collection.updateOne/
      //i am using matchedcount because if i use the modifiedcount , it doesn't return updated count because i am using $addToSet, as the listing is already present, so found this solution to fix the bug
      if (updatedScout.matchedCount === 0) {
        
        throw 'Failed to add Listing to the Scout Collection.';
      }

      const updatedListing = await listingCollection.findOneAndUpdate(
        { _id: listingIDObj },
        {
            $set: {
                progressbar: 25,
                scoutID: userIDObj
            }
        },
        { returnOriginal: false }
    );

    if (updatedListing.matchedCount === 0) {
        
      throw 'Failed to Add scoutID to the listing collection.';
    }

  
      return true;
  



  } catch (error) {
      throw error;
  }
};

//Logic for getting scout user's Active Subscribed Listingss
export const getScoutActiveSubscribedListings = async (userID) =>{

  console.log("getScoutActiveSubscribedListingIDs Data is triggered!");
  try {

      //checking if it is a valid userID or not
      helpers.isValidObjectID(userID, "Scout User ID");
      //converting it into a ObjectID type
      let userIDObj = new ObjectId(userID)

      const scoutCollection = await scoutUsers();
      //this will give me all the scout users from
      const scoutUser = await scoutCollection.findOne({_id: userIDObj})

      if(!scoutUser){
        throw `Couldn't find the scout user!!`
      }

      //The filter method will help me get all the listings object from the subscribedListing attribute of the scout user where active is true
      //this is because i want to select only the listings that is currently active
      console.log("Subscribed Listings -> ");

      for(let i=0; i<scoutUser.subscribedlistings.length; i++){
        console.log(scoutUser.subscribedlistings[i].listingID + " " + scoutUser.subscribedlistings[i].active);
      }

      const activeListings = scoutUser.subscribedlistings.filter(listing => listing.active === true);
      //this logic will help me return only the id's of each listing object 
      const listingIDList = activeListings.map(listing=>listing.listingID)

      console.log("ListingIDList -> ", listingIDList);

      if(listingIDList.length !==0){
        const listingCollection = await listings();
        //reffered https://www.mongodb.com/docs/manual/reference/operator/query/in/ . &in is used to help us return any document whose attrubute matches any elelents in the list
        const activeSubscribedListings = await listingCollection.find({ _id: { $in: listingIDList } }).toArray();

        const resultListings = []

        console.log("activesublisting -> ", activeSubscribedListings);

        for(let i=0; i< activeSubscribedListings.length; i++){
          activeSubscribedListings[i]._id = activeSubscribedListings[i]._id.toString()
          resultListings.push(activeSubscribedListings[i]);
        }

        if(resultListings.length===0){
          console.log("Empty resultListings");
          return [];
        }
        else{
          console.log("Resulting Lists -> ", resultListings);
          return resultListings;
        }
      }else {
        return [];
      }


  } catch (error) {
      throw error;
  }
};




//Logic for getting scout user's subscribed listings History
export const getScoutSubscribedListingsHistory = async (userID) =>{

  console.log("getScoutSubscribedListingsHistory Data is triggered!");
  try {

      //checking if it is a valid userID or not
      helpers.isValidObjectID(userID, "Scout User ID");
      //converting it into a ObjectID type
      let userIDObj = new ObjectId(userID)

      const scoutCollection = await scoutUsers();
      //this will give me all the scout users from
      const scoutUser = await scoutCollection.findOne({_id: userIDObj})

      if(!scoutUser){
        throw `Couldn't find the scout user!!`
      }

      //The filter method will help me get all the listings object from the subscribedListing attribute of the scout user where active is false
      //this is because i want to select only the listings that is currently inactive
      console.log("Subscribed Listings -> ");

      for(let i=0; i<scoutUser.subscribedlistings.length; i++){
        console.log(scoutUser.subscribedlistings[i].listingID + " " + scoutUser.subscribedlistings[i].active);
      }

      const inactiveListings = scoutUser.subscribedlistings.filter(listing => listing.active === false);
      //this logic will help me return only the id's of each listing object 
      const listingIDList = inactiveListings.map(listing=>listing.listingID)

      console.log("ListingIDList -> ", listingIDList);

      if(listingIDList.length !==0){
        const listingCollection = await listings();
        //reffered https://www.mongodb.com/docs/manual/reference/operator/query/in/ . &in is used to help us return any document whose attrubute matches any elelents in the list
        const subscribedListingsHistory = await listingCollection.find({ _id: { $in: listingIDList } }).toArray();

        const historyListings = []

        console.log("activesublisting -> ", subscribedListingsHistory);

        for(let i=0; i< subscribedListingsHistory.length; i++){
          subscribedListingsHistory[i]._id = subscribedListingsHistory[i]._id.toString()
          historyListings.push(subscribedListingsHistory[i]);
        }

        if(historyListings.length===0){
          console.log("Empty historyListings");
          return [];
        }
        else{
          console.log("Subscribed Listings History -> ", historyListings);
          return historyListings;
        }
      }else {
        return [];
      }


  } catch (error) {
      throw error;
  }
};

//This function retrieves the scout collection based on the scoutID provided
export const getScoutDetails = async (userID) =>{

  

console.log(" getScoutDetails Data is triggered!");
try {

  helpers.isValidObjectID(userID, "User ID");

  let userIDObj = new ObjectId(userID);

  console.log("User ID -> ", userIDObj.toString());

  const usersCollection = await scoutUsers();
  const user = await usersCollection.findOne({ _id: userIDObj });

  if(!user){
      throw `Your Session has expired! Please try logging in again!!`
  }

  user._id = user._id.toString();

  return user;

} catch (error) {
  throw error;
}
}

export const getScoutNameDetails = async (userID) =>{

  

  console.log(" getScoutName Data is triggered!");
  try {
  
    let user = await getScoutDetails(userID);
  
    let name = `${user.firstName} ${user.middleName} ${user.lastName}`;
    return {name: name, user: user};
  
  } catch (error) {
    throw error;
  }
  }






//confirm with TAs if this additional code is required since we are already exporting functions individually
export default {createUser,checkUser,getAllListings,searchListings, viewListings, getWalletBalance, subscribe, getScoutActiveSubscribedListings, getScoutSubscribedListingsHistory,updateUser, getScoutDetails, getScoutNameDetails}