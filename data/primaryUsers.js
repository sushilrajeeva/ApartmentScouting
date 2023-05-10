//took reference from lab6
import {Router} from 'express';
import {ObjectId} from 'mongodb';
import { primaryUsers} from '../config/mongoCollections.js'
import { listings } from '../config/mongoCollections.js';
import { scoutUsers } from '../config/mongoCollections.js';
import { messages } from '../config/mongoCollections.js';
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
  
  //check if inputs are empty or not



  try {

    firstName = helpers.checkEmptyInputString(firstName,"First Name");
    //middleName = helpers.checkEmptyInputString(middleName,"First Name");
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

    if(userType.toLowerCase() !== "primary user"){
        throw `Error: Primary User is not selected`    
    }
    
 
    //checking if this valid email id is already a user or not in our db
    const usersCollection = await primaryUsers();
    const user = await usersCollection.findOne({emailAddress});

    //this logic is for not allowing users to register with same email with different type of users
    const scoutCollection = await scoutUsers();
    const scoutUser = await scoutCollection.findOne({emailAddress});



    if(user){
      throw `The email address - ${emailAddress} that you used to register as primary user, already exist! please recheck your email and try registering, or else try loggin in if you already have an account as a primary user!`
    }

    if(scoutUser){
      throw `The email address - ${emailAddress} that you are using to register as primary user, already exists in our system as a scout User. 
      You can only register once in our system! if you want to use this email, then please update your scout user and replace it with some other email`
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
  console.log("Primary user Update User function is called!!");
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

    const usersCollection = await primaryUsers();
    const user = await usersCollection.findOne({ _id: new ObjectId(userId) });

    //this logic is for not allowing users to register with same email with different type of users
    const scoutCollection = await scoutUsers();
    const scoutUser = await scoutCollection.findOne({emailAddress});

    console.log("Before ");

    if (user.emailAddress !== emailAddress) {
      let checkPrUsr = await usersCollection.findOne({ emailAddress: emailAddress})
      if(checkPrUsr){
        throw `can't update with this email ${emailAddress} as it is already taken by some other primary user!`;
      }
      let checkScUsr = await scoutCollection.findOne({ emailAddress: emailAddress})
      if(checkScUsr){
        throw `can't update with this email ${emailAddress} as it is already taken by some other scout user!`;
      }
      
    }

    console.log("After");

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


export const getuser = async (
  emailAddress, role
  ) => {
    if(role.toLowerCase() === 'primary user'){
      const primaryUsersCollection = await primaryUsers();
    const primary = await primaryUsersCollection.findOne({emailAddress});
    primary._id = primary._id.toString();
    return primary;
    }else{
      const scoutUsersCollection = await scoutUsers();
    const scout = await scoutUsersCollection.findOne({emailAddress});
    scout._id = scout._id.toString(); 
    return scout;
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
    rent,
    additionalInfo,
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
        rent = helpers.checkEmptyInputString(rent, "Rent");
        additionalInfo = helpers.checkEmptyInputString(additionalInfo, "Additional Info");
        agentNumber = helpers.checkEmptyInputString(agentNumber, "Agent Number");
        ownerNumber = helpers.checkEmptyInputString(ownerNumber, "Owner Number");
        reward = helpers.checkEmptyInputString(reward, "Reward");

        //helpers.checkNameInput(listingName, "Listing Name");
        helpers.checkPropertyNameInput(listingName, "Listing Name");
        helpers.isValidWebsiteLink(listingLink);
        helpers.isValidCountry(country);
        helpers.isValidPincode(pincode);
        helpers.isValidRent(rent);
        helpers.isValidAdditionalInfo(additionalInfo);
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
            rent: rent,
            additionalInfo: additionalInfo,
            agentNumber: agentNumber,
            ownerNumber: ownerNumber,
            reward: reward,
            progressbar: 0,
            scoutID: null,
            messageID: ""
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


export const updateListing = async ( listingID,
  emailAddress,
  listingName,
  listingLink,
  street,
  city,
  state,
  country,
  pincode,
  rent,
  additionalInfo,
  agentNumber,
  ownerNumber,
  reward) => {

  console.log("Add listing method of primary user : DATA is called!!");

  try {

      listingID = helpers.checkEmptyInputString(listingID, "Listing ID");
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
      rent = helpers.checkEmptyInputString(rent, "Rent");
      additionalInfo = helpers.checkEmptyInputString(additionalInfo, "Additional Info");
      agentNumber = helpers.checkEmptyInputString(agentNumber, "Agent Number");
      ownerNumber = helpers.checkEmptyInputString(ownerNumber, "Owner Number");
      reward = helpers.checkEmptyInputString(reward, "Reward");

      helpers.checkPropertyNameInput(listingName, "Listing Name");
      helpers.isValidWebsiteLink(listingLink);
      helpers.checkStreetName(street);
      helpers.checkStateNameInput(state, "State");
      helpers.checkStateNameInput(city, "City");
      helpers.isValidCountry(country);
      helpers.isValidPincode(pincode);
      helpers.isValidRent(rent);
      helpers.isValidAdditionalInfo(additionalInfo);
      helpers.validPhoneNumber(agentNumber);
      helpers.validPhoneNumber(ownerNumber);
      helpers.validRewards(reward);

      const usersCollection = await primaryUsers();
      const user = await usersCollection.findOne({emailAddress});

      const userID = user._id.toString();

      if(!user){
          throw `Logged In user's email address is invalid, please try logging into the application`
      }

      const listingCollection = await listings();


      const listingData = {
          listingName: listingName,
          userID: user._id,
          listingLink: listingLink,
          street: street,
          city: city,
          state: state,
          country: country,
          pincode: pincode,
          rent: rent,
          additionalInfo: additionalInfo,
          agentNumber: agentNumber,
          ownerNumber: ownerNumber,
          reward: reward,
        };


        
        // const listing = await listingCollection.insertOne(listingData)
        //const listing = await listingCollection.findOneAndReplace({_id:  new ObjectId(listingID)}, listingData, {returnOriginal: false})
        //since i am updating only partial portion of the collection so i will use findOneAndUpdate instead of findOneAndReplace
        const listing = await listingCollection.findOneAndUpdate(
          { _id: new ObjectId(listingID) },
          {
              $set: {
                  listingName: listingData.listingName,
                  userID: listingData.userID,
                  listingLink: listingData.listingLink,
                  street: listingData.street,
                  city: listingData.city,
                  state: listingData.state,
                  country: listingData.country,
                  pincode: listingData.pincode,
                  rent: listingData.rent,
                  additionalInfo: listingData.additionalInfo,
                  agentNumber: listingData.agentNumber,
                  ownerNumber: listingData.ownerNumber,
                  reward: listingData.reward,
              },
          },
          { returnOriginal: false }
      );
          


      if (!listing.value){
          throw 'Could not add listing';
      }

      console.log("Checking listing IDS ");
      console.log("listing.insertedID -> ", listing.insertedId);

      const updateResult = await usersCollection.findOne({ _id: user._id },);
      

        if (updateResult) {
          console.log('Listings updated successfully');
          console.log('Updated document:', updateResult);
        } else {
          throw `Unable to update listing details in primary user collection!`
        }
      
        let updatedUser = updateResult;


        return {updatedUser: updatedUser, listingID: listing.value._id.toString()}
 
  } catch (error) {
      throw error;
  }


  

};


//This method allows Primary users to get all the listings from the listings collections that belongs to the primary user's userID
export const viewListings = async (userID
    ) =>{

    console.log("View Listings Data is triggered!");
    try {

        helpers.isValidObjectID(userID, "User ID");

        let userIDObj = new ObjectId(userID);

        //To query listings based on primary user's id
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

export const getWalletBalance = async (userID) =>{

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

export const addMoneyToWallet = async (userID, cardNumber, cvv, amount) =>{

  //Added wallet functionality. This functionality allows primary user to add monety to his/her wallet balance

console.log("Add money to  Wallet Data is triggered!");
try {

  helpers.checkEmptyInputString(userID, "User ID")
  helpers.isValidObjectID(userID, "User ID");

  cardNumber = helpers.checkEmptyInputString(cardNumber, "Card Number");
  cvv = helpers.checkEmptyInputString(cvv, "CVV");
  amount = helpers.checkEmptyInputString(amount, "Amount");

  helpers.isValidCardNumber(cardNumber);
  helpers.isValidCVV(cvv);
  helpers.isValidAmount(amount);


  let userIDObj = new ObjectId(userID);

  console.log("User ID -> ", userIDObj.toString());

  const usersCollection = await primaryUsers();
  const user = await usersCollection.findOne({ _id: userIDObj });

  if(!user){
      throw `Your Session has expired! Please try logging in again!!`
  }

  helpers.validCardCredentials(cardNumber, cvv);
  

  //currently amount is a string so converting it to Integer
  let walletBalance = user.wallet + parseInt(amount, 10);

  //I am using { returnDocument: 'after' } instead of {returnOriginal : false} because mongo has depricated this after version 3.6+. My current mongo version is 4.x.x
  const updatedUser = await usersCollection.findOneAndUpdate(
    { _id: userIDObj },
    { $set: { wallet: walletBalance } },
    { returnDocument: 'after' }
  );

  if (updatedUser.value) {
    console.log('User is updated successfully');
    console.log('Updated document:', updatedUser.value);
  } else {
    throw `Unable to update wallet balance of primary user collection!`
  }

  console.log();

    updatedUser.value._id = updatedUser.value._id.toString();


  return updatedUser.value;

} catch (error) {
  throw error;
}
}

//to view all the listings of primary subscribers that are subscribed by some scout!
export const viewScoutSubscribedlistings = async (userID) =>{

  console.log("View Listings Data is triggered!");
  try {

      helpers.isValidObjectID(userID, "User ID");

      let userIDObj = new ObjectId(userID);

      //To query listings based on primary user's id and scout id not null
      //This is because if they are null means no scout has subscribed!
      const query = { 
        userID: userIDObj,
        scoutID: { $ne: null }
      };

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
};


export const postComment = async (listingID, userID, scoutID, comment) =>{

  console.log("Primary User posting comment Data is triggered!");
  try {


      listingID =  helpers.checkEmptyInputString(listingID, "ListingID");
      userID = helpers.checkEmptyInputString(userID, "User ID");
      scoutID = helpers.checkEmptyInputString(scoutID, "Scout ID");
      comment = helpers.checkEmptyInputString(comment, "comment");

      helpers.isValidComment(comment);


      helpers.isValidObjectID(listingID, "Listing ID");
      helpers.isValidObjectID(userID, "User ID");
      helpers.isValidObjectID(scoutID, "Scout ID");
      

      let listingIDObj = new ObjectId(listingID);
      let userIDObj = new ObjectId(userID);
      let scoutIDObj = new ObjectId(scoutID);

      //I will first get the listing from listings collection
      const listingsCollection = await listings();
      let getListingquery =  { _id: listingIDObj };
      const listing = await listingsCollection.findOne(getListingquery);

      if(!listing.messageID || listing.messageID === ""){
        listing.messageID = new ObjectId();
        console.log("Am i even called???");
      }

      const messageID = listing.messageID

      console.log("Message ID -> ", messageID);

      // Updating the listing with the messageID whose _id is ListingID
      const updatedListing = await listingsCollection.updateOne(
        { _id: listingIDObj },
        { $set: { messageID: messageID } }
      );

      if (updatedListing.modifiedCount === 1) {
        console.log("Listing updated successfully");
      } else {
        console.log("Failed to update listing");
    }


    // Checking if a message with _id: messageID exists in our collection
    const messagesCollection = await messages();
    const message = await messagesCollection.findOne({ _id: messageID });

    if (message) {
      // Message with _id: messageID exists
      console.log("Message found:", message);


    

    // The new comment object to be added
    const newComment = {
      userID: userIDObj,
      scoutID: scoutIDObj,
      commenterId: userIDObj,
      comment: comment,
      timestamp: new Date()
  };


      // Updating the messages collection by adding the new comment object to the comments array in the comment collection of my mongo collection
      const updatedMessage = await messagesCollection.findOneAndUpdate(
        { _id: messageID },
        { $push: { comments: newComment } },
        { returnOriginal: false} // Return the updated document
      );

      if (updatedMessage && updatedMessage.value) {
        let msgQuery = {_id: messageID}
        const result = await messagesCollection.findOne(msgQuery);

        result._id = result._id.toString();
      
        console.log("Message updated successfully with the new comment");
        console.log("Let's check the updated message result - ", updatedMessage.value);
      
        return result;
      } else {
        console.log("Failed to update message");
        throw `The comment you tried to post didn't not go through!!`;
      }


    } else {
      // Message with _id: messageID doesn't exist
      console.log("Message not present");

      const messageData = {
        _id: messageID,
        listingID: listingIDObj,
        comments: [
          {
            userID: userIDObj,
            scoutID: scoutIDObj,
            commenterId: userIDObj,
            comment: comment,
            timestamp: new Date()
          }
        ]
      }


      // Insert message data into the messages collection
      const messagesCollection = await messages();
      const insertedOutput = await messagesCollection.insertOne(messageData);

      if (insertedOutput.insertedCount === 1) {
        console.log("Message data inserted successfully");
      } else {
        console.log("Failed to insert message data");
      }
      
      // Fetch the inserted message document
      const insertedMessage = await messagesCollection.findOne({ _id: messageID });
      
      if (insertedMessage) {
        insertedMessage._id = insertedMessage._id.toString();
        return insertedMessage;
        // Perform any additional actions or return the insertedMessage
      } else {
        console.log("Failed to fetch the inserted message");
        // Handle the error or return an appropriate value
      }

    }


    





  } catch (error) {
      throw error;
  }
};


//This function retrieves the scout collection based on the scoutID provided
export const getPrimaryDetails = async (userID) =>{

  

  console.log(" getPrimaryDetails Data is triggered!");
  try {
  
    helpers.isValidObjectID(userID, "User ID");
  
    let userIDObj = new ObjectId(userID);
  
    console.log("User ID -> ", userIDObj.toString());
  
    const usersCollection = await primaryUsers();
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
  
  export const getPrimaryNameDetails = async (userID) =>{
  
    
  
    console.log(" getPrimaryNameDetails Data is triggered!");
    try {
    
      let user = await getPrimaryDetails(userID);
    
      let name = `${user.firstName} ${user.middleName} ${user.lastName}`;
      return {name: name, user: user};
    
    } catch (error) {
      throw error;
    }
    };


    export const subtractRewardMoney = async (userID, reward) => {
      console.log("subtractRewardMoney Data is triggered!");
    
      try {
        helpers.isValidObjectID(userID, "Primary User ID");
    
        const userIDObj = new ObjectId(userID);
        const usersCollection = await primaryUsers();
    
        const user = await usersCollection.findOne({ _id: userIDObj });
    
        // Converting the wallet balance from a string to a number and adding the reward
        const updatedWalletBalance = parseInt(user.wallet,10) - parseInt(reward,10);
    
        
        const result = await usersCollection.updateOne(
          { _id: userIDObj },
          {
            $set: {
              wallet: updatedWalletBalance,
            },
          }
        );
    
        // to Check if the update was successful
        // to Check if the update was successful
    if (result.modifiedCount === 0) {
      throw new Error('Failed to update the wallet balance');
    }

    return {
      modifiedCount: result.modifiedCount,
      newWalletBalance: updatedWalletBalance,
    };
    
      } catch (error) {
        throw error;
      }
    };
  


//confirm with TAs if this additional code is required since we are already exporting functions individually
export default {createUser,checkUser,addListing, viewListings, getWalletBalance, getuser, updateListing, updateUser, addMoneyToWallet, viewScoutSubscribedlistings, postComment, getPrimaryDetails, getPrimaryNameDetails, subtractRewardMoney}