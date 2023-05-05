//took reference from lab6
import {Router} from 'express';
import {ObjectId} from 'mongodb';
import { primaryUsers} from '../config/mongoCollections.js'
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

  console.log("Create User function is called!!");
  console.log({firstName: firstName, middleName: middleName, lastName: lastName, emailAddress: emailAddress, countryCode: countryCode, phoneNumber: phoneNumber, city: city, state: state, country: country, dob: dob, password: password, confirmPassword: confirmPassword, userType: userType});
  let codeCountry = "";
  //check if inputs are empty or not



  try {

    firstName = helpers.checkEmptyInputString(firstName,"First Name");
    middleName = helpers.checkEmptyInputString(middleName,"First Name");
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

    if(userType.toLowerCase() !== "primary user"){
        throw `Error: Primary User is not selected`    
    }
    
 
    //checking if this valid email id is already a user or not in our db
    const usersCollection = await primaryUsers();
    const user = await usersCollection.findOne({emailAddress});

    if(user){
      throw `The email address - ${emailAddress} that you used to register as primary user, already exist! please recheck your email and try registering, or else try loggin in if you already have an account as a primary user!`
    }

    //Used professor's lecture code for password hashing
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    //since everything went well and nothing blew up !!so i will push it to the db

    let primaryUserData = {
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
      listings: [],
      wallet: 1000
    }

    const insertInfo = await usersCollection.insertOne(primaryUserData);

    if (!insertInfo.acknowledged || !insertInfo.insertedId){
      throw 'Could not add user';
    }

    return {insertedUser: true};


  } catch (error) {
    throw error;
  }


};

export const checkUser = async (emailAddress, password) => {

  try {

    emailAddress = helpers.checkEmptyInputString(emailAddress, "Email Address");
    emailAddress.toLowerCase();
    helpers.checkEmptyInputString(password, "Password");

    helpers.checkValidEmail(emailAddress);
    helpers.checkValidPassword(password);

    //since nothing blew up till here, let's query the db to check if an user collection with given email is present or not

    const usersCollection = await primaryUsers();
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

//This is to enable users to add their listings to the db
export const addListing = async (emailAddress,
    listingName,
    listingLink,
    street,
    city,
    state,
    country,
    pincode,
    agentNumber,
    ownerNumber,
    reward) => {

    console.log("Add listing method of primary user : DATA is called!!");

    try {

        emailAddress = helpers.checkEmptyInputString(emailAddress, "Email Address");
        emailAddress.toLowerCase();
        helpers.checkValidEmail(emailAddress);

        listingName = helpers.checkEmptyInputString(listingName, "Listing Name");
        listingLink = helpers.checkEmptyInputString(listingLink, "Listing Link");
        street = helpers.checkEmptyInputString(street, "Street");
        city = helpers.checkEmptyInputString(city, "City");
        state = helpers.checkEmptyInputString(state, "State");
        country = helpers.checkEmptyInputString(country, "Country");
        pincode = helpers.checkEmptyInputString(pincode, "Pincode");
        agentNumber = helpers.checkEmptyInputString(agentNumber, "Agent Number");
        ownerNumber = helpers.checkEmptyInputString(ownerNumber, "Owner Number");
        reward = helpers.checkEmptyInputString(reward, "Reward");

        helpers.checkNameInput(listingName, "Listing Name");
        helpers.isValidWebsiteLink(listingLink);
        helpers.isValidCountry(country);
        helpers.isValidPincode(pincode);
        helpers.validPhoneNumber(agentNumber);
        helpers.validPhoneNumber(ownerNumber);
        helpers.validRewards(reward);

        const usersCollection = await primaryUsers();
        const user = await usersCollection.findOne({emailAddress});

        const userID = user._id.toString();

        if(!user){
            throw `Logged In user's email address is invalid, please try logging into the application`
        }

        const listingData = {
            _id: new ObjectId(),
            userID: user._id,
            listingName: listingName,
            listingLink: listingLink,
            street: street,
            city: city,
            state: state,
            country: country,
            pincode: pincode,
            agentNumber: agentNumber,
            ownerNumber: ownerNumber,
            reward: reward,
          };


          const listingCollection = await listings();
          const listing = await listingCollection.insertOne(listingData)


        if (!listing.acknowledged || !listing.insertedId){
            throw 'Could not add listing';
        }

        console.log("Checking listing IDS ");
        console.log("listing.insertedID -> ", listing.insertedId);

        const updateResult = await usersCollection.findOneAndUpdate(
            { _id: user._id },
            {
              $push: {
                listings: {
                  _id: listingData._id
                }
              }
            },
            { returnDocument: 'after' } 
          );
        

          if (updateResult.value) {
            console.log('Listings updated successfully');
            console.log('Updated document:', updateResult.value);
          } else {
            throw `Unable to update listing details in primary user collection!`
          }
        
          let updatedUser = updateResult.value;


          return {updatedUser: updatedUser, listingID: listing.insertedId.toString() }
   
    } catch (error) {
        throw error;
    }


    
  
};

export const viewListings = async (userID
    ) =>{

    console.log("View Listings Data is triggered!");
    try {

        helpers.isValidObjectID(userID, "User ID");

        let userIDObj = new ObjectId(userID);

        const query = { userID: userIDObj };

        const listingCollection = await listings();
        const userListings = await listingCollection.find(query).toArray();

        if(!userListings){
            return []
        }else {
            return userListings;
        }

    } catch (error) {
        throw error;
    }
}

export const getWalletBalance = async (userID
    ) =>{

        //Added wallet functionality. This functionality allows primary user to fetch his/her wallet balance

    console.log("Get Wallet Balance Data is triggered!");
    try {

        helpers.isValidObjectID(userID, "User ID");

        let userIDObj = new ObjectId(userID);

        console.log("User ID -> ", userIDObj.toString());

        const usersCollection = await primaryUsers();
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
export default {createUser,checkUser,addListing, viewListings, getWalletBalance}