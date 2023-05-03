//import express, express router as shown in lecture code

import {Router} from 'express';
const router = Router();
import bcrypt from 'bcryptjs';
import middlewareMethods from '../middleware.js';
import helpers from '../helpers.js';
import primaryUsers from '../data/primaryUsers.js';
import scoutUsers from '../data/scoutUsers.js';
import xss from 'xss';

//refered https://www.youtube.com/watch?v=TDe7DRYK8vU this youtube video for passing the middlewear [timestamp - 26:30 ish ]
router.route('/').get(middlewareMethods.checkAuthentication, async (req, res) => {
  //code here for GET THIS ROUTE SHOULD NEVER FIRE BECAUSE OF MIDDLEWARE #1 IN SPECS.
  return res.json({error: 'YOU SHOULD NOT BE HERE!'});
});
7
router
  .route('/registeruser')
  .get(middlewareMethods.registerMiddleware, async (req, res) => {
    //code here for GET

    //using this logic to calculate max date so user with less than 18 doesn't register
    const today = new Date();
    const maxDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`

    let countryList = helpers.countryCalculator(helpers.countryCodes)
    console.log("Primary User Regester GET Route is called!!");
    res.render('registeruser', {title: 'Primary User Register', countryCodes: helpers.countryCodes, countryList: countryList, defaultCountry: helpers.defaultCountry, maxDate: maxDate})
  })
  .post(async (req, res) => {
    //code here for POST
    console.log("Regester POST route is called!!");

    

    let firstName = xss(req.body.firstNameInput);
    let middleName = xss(req.body.middleNameInput);
    let lastName = xss(req.body.lastNameInput);
    let emailAddress = xss(req.body.emailAddressInput);
    let countryCode = xss(req.body.countryCodeInput);
    let phoneNumber = xss(req.body.phoneNumberInput);
    let city = xss(req.body.cityInput);
    let state = xss(req.body.stateInput);
    let country = xss(req.body.countryInput);
    let dob = xss(req.body.dobInput);
    let password = xss(req.body.passwordInput);
    let confirmPassword = xss(req.body.confirmPasswordInput);
    let userType = xss(req.body.userTypeInput);

    console.log("ola");

    console.log({firstName: firstName, middleName: middleName, lastName: lastName, emailAddress: emailAddress, countryCode: countryCode, phoneNumber: phoneNumber, city: city, state: state, country: country, dob: dob, password: password, confirmPassword: confirmPassword, userType: userType});
            
    let codeCountry = "";
    

    try {

      //checking input strings are empty or not
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

      console.log("Everything work's fine!!");
      
      //Now running it by the DB

      if(userType.toLowerCase() === "primary user"){
        console.log("Creating primary user DB!!");
        const createdUser = await primaryUsers.createUser(firstName, middleName, lastName, emailAddress, countryCode, phoneNumber, city, state, country, dob, password, confirmPassword, userType);
        if(createdUser.insertedUser === true){
          //if this condition is valid i will load my login page
          //console.log("Created user validation hit");
          
          return res.redirect('/login');
          
        }else {
          //console.log("Didn't blow up !!");
          return res.status(500).json({error: 'Internal Server Error'});
        }
      
      }else{
        console.log("Creating scout user DB!!");
        //do same as above for scout user!!
        const createdUser = await scoutUsers.createUser(firstName, middleName, lastName, emailAddress, countryCode, phoneNumber, city, state, country, dob, password, confirmPassword, userType);
        if(createdUser.insertedUser === true){
          //if this condition is valid i will load my login page
          //console.log("Created user validation hit");
          
          return res.redirect('/login');
          
        }else {
          //console.log("Didn't blow up !!");
          return res.status(500).json({error: 'Internal Server Error'});
        }
      }

      // const createdUser = await users.createUser(firstName, lastName, emailAddress, password, role);

      

      
    } catch (error) {
      console.log("Error caugth");
      console.log(error);
      res.status(400).render('registeruser',{title: 'register', error: `<div id="error" class="error" > ${error}</div>`});
    }

    //console.log({firstName: firstName, lastName: lastName, emailAddress, emailAddress, password: password, confirmPassword: confirmPassword, role: role});




    });

router
  .route('/login')
  .get(middlewareMethods.loginMiddleware, async (req, res) => {
    //code here for GET
    //console.log("GET Login Route is called");
    res.render('login', {title: 'login'})
  })
  .post(async (req, res) => {
    //code here for POST
    console.log("Post login is called");

    console.log(req.body);

    let userType = xss(req.body.userTypeInput);
    let emailAddress = xss(req.body.emailAddressInput);
    let password = xss(req.body.passwordInput);

    try {
      userType = helpers.checkEmptyInputString(userType, "User Type");
      userType = userType.toLowerCase();
      emailAddress = helpers.checkEmptyInputString(emailAddress, "Email Address");
      emailAddress.toLowerCase();
      helpers.checkEmptyInputString(password, "Password");

      helpers.checkValiduserType(userType)
      helpers.checkValidEmail(emailAddress);
      helpers.checkValidPassword(password);

      //sending to the db validation

      //triggering login based on user type

      if(userType==="primary user"){
        console.log("primary user checkUser method will be triggered");
        const loginUser = await primaryUsers.checkUser(emailAddress, password);
        req.session.user = {
          _id: loginUser._id.toString(),
          firstName: loginUser.firstName,
          middleName: loginUser.middleName,
          lastName: loginUser.lastName,
          emailAddress: loginUser.emailAddress,
          countryCode: loginUser.countryCode, 
          phoneNumber: loginUser.phoneNumber, 
          city: loginUser.city, 
          state: loginUser.state, 
          country: loginUser.country, 
          dob: loginUser.dob,
          listings: loginUser.listings,
          wallet: loginUser.wallet,
          role: loginUser.role,
        }
  
        //redirecting based on the loginUser.role
  
        if(loginUser.role.toLowerCase() === "primary user"){
          return res.redirect('/primaryuser')
        }else{
          return res.redirect('/scoutuser')
        }
        
      }else{
        console.log("scout user checkUser method will be triggered");
        const loginUser = await scoutUsers.checkUser(emailAddress, password);
        req.session.user = {
          _id: loginUser._id.toString(),
          firstName: loginUser.firstName,
          middleName: loginUser.middleName,
          lastName: loginUser.lastName,
          emailAddress: loginUser.emailAddress,
          countryCode: loginUser.countryCode, 
          phoneNumber: loginUser.phoneNumber, 
          city: loginUser.city, 
          state: loginUser.state, 
          country: loginUser.country, 
          dob: loginUser.dob,
          subscribedlistings: loginUser.subscribedlistings,
          wallet: loginUser.wallet,
          role: loginUser.role,
        }
  
        //redirecting based on the loginUser.role
  
        if(loginUser.role.toLowerCase() === "primary user"){
          return res.redirect('/primaryuser')
        }else{
          return res.redirect('/scoutuser')
        }
      }

      //const loginUser = await users.checkUser(emailAddress, password);

      


      

    } catch (error) {
      //console.log("Login Error Caught: ", error);
      return res.status(400).render('login', {title: 'login', error: `<div id="error" class="error" > ${error}</div>`})
      //res.status(400).json({error: error})
    }


    //console.log({email: emailAddress, password: password});

  });

router.route('/scoutuser').get(middlewareMethods.protectedMiddleware, async (req, res) => {
  //code here for GET
  //console.log("Protected route is hit");
  let firstName = xss(req.session.user.firstName);
  let role = xss(req.session.user.role);
  
  if(role.toLowerCase().trim()==='primary user'){
    let htmlCode = `<p><a href="/primaryuser">Click here to Access primary user Route</a></p>`
    res.render('scoutuser', {title: 'scout user', firstName: firstName, currentTime: new Date().toUTCString(), role: role, primaryuser: htmlCode})
  }else{
    res.render('scoutuser', {title: 'scout user', firstName: firstName, currentTime: new Date().toUTCString(), role: role})
  }
});

router.route('/primaryuser').get(middlewareMethods.adminMiddleware, async (req, res) => {
  //code here for GET
  console.log("Primary user route is hit");
  let firstName = xss(req.session.user.firstName);
  
  res.render('primaryuser', {title: 'primary user', firstName: firstName, currentTime: new Date().toUTCString()})
});

router.route('/error').get(async (req, res) => {
  //code here for GET
  res.render('error', {title: 'error'})
});

router.route('/logout').get(middlewareMethods.logoutMiddleware, async (req, res) => {
  //code here for 
  let firstName = xss(req.session.user.firstName);
  req.session.destroy();
  res.render('logout', {title: 'logout', firstName: firstName});
});

router.route('/addlisting').get(async(req, res)=>{
  console.log("Get Method of Add Listing route is triggered!");
  let countryList = helpers.countryCalculator(helpers.countryCodes)
  res.render('addListing', {title: 'Add Listings' ,countryCodes: helpers.countryCodes, countryList: countryList})
}).post(async(req,res)=>{
  console.log("Post Method of Add Listing route is triggered!!");
  
  let listingName = xss(req.body.listingNameInput);
  let listingLink = xss(req.body.listingLinkInput);
  let street = xss(req.body.streetInput);
  let city = xss(req.body.cityInput);
  let state = xss(req.body.stateInput);
  let country = xss(req.body.countryInput);
  let pincode = xss(req.body.pincodeInput);
  let agentNumber = xss(req.body.agentNumberInput);
  let ownerNumber = xss(req.body.ownerNumberInput);
  let reward = xss(req.body.rewardInput);

  const inputData = {
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


  //validations

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

    let emailAddress = xss(req.session.user.emailAddress);

    try {
      helpers.checkValidEmail(emailAddress);
    } catch (error) {
      req.session.destroy();
      return res.render('error', {title: 'Invalid Session', error: `Your login email is invalid!! Something went wrong!! Please try logging in!`})
    }

    console.log("Checking if i can access my cookies!!");
    console.log(req.session.user);



    const userListing = await primaryUsers.addListing(emailAddress, listingName, listingLink, street, city, state, country, pincode, agentNumber, ownerNumber, reward);

    console.log("Updated User -> ", userListing.updatedUser);
    console.log("listingID -> ", userListing.listingID);


    let updatedUser = userListing.updatedUser;
    let listingID = userListing.listingID;


  let successMsg = `<div id="successMsg" class="successMsg" > Your Listing Details have been Successfully Recorded! Your Listing Ref ID is : ${listingID}</div>`

  //updating our cookie
  req.session.user = {
    _id: xss(updatedUser._id.toString()),
    firstName: xss(updatedUser.firstName),
    middleName: xss(updatedUser.middleName),
    lastName: xss(updatedUser.lastName),
    emailAddress: xss(updatedUser.emailAddress),
    countryCode: xss(updatedUser.countryCode), 
    phoneNumber: xss(updatedUser.phoneNumber), 
    city: xss(updatedUser.city), 
    state: xss(updatedUser.state), 
    country: xss(updatedUser.country), 
    dob: updatedUser.dob,
    listings: updatedUser.listings,
    wallet: xss(updatedUser.wallet),
    role: xss(updatedUser.role),
  }

  console.log("Updated user session cookie : ", req.session.user);


  let countryList = helpers.countryCalculator(helpers.countryCodes)
  return res.render('addListing', {title: 'Add Listings' ,countryCodes: helpers.countryCodes, countryList: countryList, success: successMsg})
  


});

router.route('/viewlistings').get(async (req, res) => {
  //code here for GET

  let userID = req.session.user._id.toString()
  const listings = await primaryUsers.viewListings(userID);
  let isEmptyListings = false;
  if(!listings){
    isEmptyListings = true;
  }

  res.render('viewlistings', {title: 'View Listings', isEmptyListings: isEmptyListings, listings: listings})
});

router.route('/getAllListings').get(async (req, res) => {
  //code here for GET

  
  const allListings = await scoutUsers.getAllListings();

  let isEmptyListings = false;
  if(!allListings){
    isEmptyListings = true;
  }

  let user = req.session.user
  if(!user){
    return res.render('landingpage', {title: 'Homepage', isEmptyListings: isEmptyListings, listings: allListings})
  }
  
}).post(async (req,res)=>{
  console.log("Search Listing post route is triggered");
  let searchKey = xss(req.body.searchInput);
  console.log("Search Key -> ", searchKey);
  const searchedListings = await scoutUsers.searchListings(searchKey);

  let isEmptyListings = false;
  if(!searchedListings){
    isEmptyListings = true;
  }

  let user = req.session.user
  if(!user){
    return res.render('landingpage', {title: 'Homepage', isEmptyListings: isEmptyListings, listings: searchedListings})
  }
});

// router.route('/searchListings').get(async (req, res) => {
//   //This code let's users to search listings based on the following parameters - city, state, country and pincode

//   console.log("Req body", req.body);
//   console.log("Req param", req.params);
//   console.log("Search Listing route is triggered");
//   let searchKey = xss(req.params.searchInput);
//   console.log("Search Key -> ", searchKey);
//   const searchedListings = await scoutUsers.searchListings(searchKey);

//   let isEmptyListings = false;
//   if(!searchedListings){
//     isEmptyListings = true;
//   }

//   let user = req.session.user
//   if(!user){
//     return res.render('landingpage', {title: 'Homepage', isEmptyListings: isEmptyListings, listings: searchedListings})
//   }
  
// }).post(async (res,req)=>{
//   console.log("Search Listing post route is triggered");
//   let searchKey = xss(req.body.searchInput);
//   console.log("Search Key -> ", searchKey);
//   const searchedListings = await scoutUsers.searchListings(searchKey);

//   let isEmptyListings = false;
//   if(!searchedListings){
//     isEmptyListings = true;
//   }

//   let user = req.session.user
//   if(!user){
//     return res.render('landingpage', {title: 'Homepage', isEmptyListings: isEmptyListings, listings: searchedListings})
//   }
// })


export default router;
