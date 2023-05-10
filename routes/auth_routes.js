//import express, express router as shown in lecture code

import {Router} from 'express';
const router = Router();
import bcrypt from 'bcryptjs';
import middlewareMethods from '../middleware.js';
import helpers from '../helpers.js';
import primaryUsers from '../data/primaryUsers.js';
import scoutUsers from '../data/scoutUsers.js';
import listings from '../data/listings.js';
import messages from '../data/messages.js';
import xss from 'xss';

//refered https://www.youtube.com/watch?v=TDe7DRYK8vU this youtube video for passing the middlewear [timestamp - 26:30 ish ]
router.route('/').get(middlewareMethods.checkAuthentication, async (req, res) => {
  //code here for GET THIS ROUTE SHOULD NEVER FIRE BECAUSE OF MIDDLEWARE #1 IN SPECS.
  return res.json({error: 'YOU SHOULD NOT BE HERE!'});
});

//Route for registering - takes care of registration of both primary and scout user along with authentication
router
  .route('/registeruser')
  .get(middlewareMethods.registerMiddleware, async (req, res) => {
    //code here for GET

    //using this logic to calculate max date so user with less than 18 doesn't register
    const today = new Date();
    const maxDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`

    let countryList = helpers.countryCalculator(helpers.countryCodes)
    console.log("Primary User Regester GET Route is called!!");
    res.render('registeruser', {title: 'New User Register', countryCodes: helpers.countryCodes, countryList: countryList, defaultCountry: helpers.defaultCountry, maxDate: maxDate})
    
  })
  .post( async (req, res) => {
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

   

    console.log({firstName: firstName, middleName: middleName, lastName: lastName, emailAddress: emailAddress, countryCode: countryCode, phoneNumber: phoneNumber, city: city, state: state, country: country, dob: dob, password: password, confirmPassword: confirmPassword, userType: userType});
            
    

    try {

      //checking input strings are empty or not
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
      helpers.checkStateNameInput(state, "State");
      helpers.checkStateNameInput(city, "City");
      helpers.checkNameInput(firstName, "First name");
      helpers.checkMidNameInput(middleName, "Middle name");
      helpers.checkNameInput(lastName, "Last name");

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
      const today = new Date();
      const maxDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
  
      let countryList = helpers.countryCalculator(helpers.countryCodes)
      console.log("Error caugth");
      console.log(error);
      //res.status(400).render('registeruser',{title: 'register', error: `<div id="error" class="error" > ${error}</div>`});
      res.status(400).render(
        'registeruser',
        {
          title: 'register',
          error: `<div id="error" class="error" > ${error}</div>`,
          countryCodes: helpers.countryCodes, 
          countryList: countryList, 
          defaultCountry: helpers.defaultCountry, 
          maxDate: maxDate,
          user: {
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
            userType: userType
          },
        });
    }

    //console.log({firstName: firstName, lastName: lastName, emailAddress, emailAddress, password: password, confirmPassword: confirmPassword, role: role});




    });

//Route for login - takes care of login of both primary and scout user along with authentication

router
  .route('/login')
  .get(middlewareMethods.loginMiddleware, async (req, res) => {
    //code here for GET
    //console.log("GET Login Route is called");
    res.render('login', {title: 'Login'})
  })
  .post( async (req, res) => {
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
          _id: xss(loginUser._id.toString()),
          firstName: xss(loginUser.firstName),
          middleName: xss(loginUser.middleName),
          lastName: xss(loginUser.lastName),
          emailAddress: xss(loginUser.emailAddress),
          countryCode: xss(loginUser.countryCode),
          phoneNumber: xss(loginUser.phoneNumber),
          city: xss(loginUser.city),
          state: xss(loginUser.state),
          country: xss(loginUser.country),
          dob: xss(loginUser.dob),
          listings: loginUser.listings,
          wallet: xss(loginUser.wallet),
          role: xss(loginUser.role),
        };
        
  
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
          _id: xss(loginUser._id.toString()),
          firstName: xss(loginUser.firstName),
          middleName: xss(loginUser.middleName),
          lastName: xss(loginUser.lastName),
          emailAddress: xss(loginUser.emailAddress),
          countryCode: xss(loginUser.countryCode),
          phoneNumber: xss(loginUser.phoneNumber),
          city: xss(loginUser.city),
          state: xss(loginUser.state),
          country: xss(loginUser.country),
          dob: xss(loginUser.dob),
          subscribedlistings: loginUser.subscribedlistings,
          wallet: xss(loginUser.wallet),
          role: xss(loginUser.role),
        };
        
  
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
      return res.status(400).render('login', {title: 'login', error: `<div id="error" class="error" > ${error}</div>`, email: emailAddress, userType: userType})
      //res.status(400).json({error: error})
    }


    //console.log({email: emailAddress, password: password});

  });


  //Route for profile - both primary and scout have access to this rout - takes care of authentication
  router.route('/profile').get(middlewareMethods.commonMiddleware, async (req, res) =>{
    //code here for GET
  

    let emailAddress = xss(req.session.user.emailAddress)
    let role = xss(req.session.user.role)
    const user = await primaryUsers.getuser(emailAddress, role);
    let countryList = helpers.countryCalculator(helpers.countryCodes)

    let isPrimary = true;
    if(role.toLowerCase().trim()!=="primary user"){
      isPrimary = false;
    }

    const today = new Date();
    const maxDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`

    res.render('profile',{title: 'profile',user:user, countryCodes: helpers.countryCodes, countryList: countryList, isPrimary: isPrimary, maxDate: maxDate})
  }).post( async (req, res)=>{

    console.log("Post profile route is triggered!!");
        let user = req.session.user;
    // Get updated user information from the form
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


    // Perform necessary validations on the updated user information
try {
  firstName = helpers.checkEmptyInputString(firstName, "First Name");
  lastName = helpers.checkEmptyInputString(lastName, "Last Name");
  emailAddress = helpers.checkEmptyInputString(emailAddress, "Email Address");
  countryCode = helpers.checkEmptyInputString(countryCode, "Country Code");
  phoneNumber = helpers.checkEmptyInputString(phoneNumber, "Phone Number");
  city = helpers.checkEmptyInputString(city, "City");
  state = helpers.checkEmptyInputString(state, "State");
  country = helpers.checkEmptyInputString(country, "Country");
  dob = helpers.checkEmptyInputString(dob, "Date of Birth");
  password = helpers.checkEmptyInputString(password, "Password");

  helpers.checkNameInput(firstName, "First name");
  helpers.checkMidNameInput(middleName, "Middle name");
  helpers.checkNameInput(lastName, "Last name");
  helpers.checkValidEmail(emailAddress);
  helpers.checkValidAge(dob);
  helpers.checkValidPassword(password);
  helpers.checkStateNameInput(state, "State");
  helpers.checkStateNameInput(city, "City");
  helpers.countryCodeExists(countryCode);
  helpers.validPhoneNumber(phoneNumber);
  helpers.validCountrySelected(country);

  let userType = xss(req.session.user.role);
  let isPrimary = true;
  console.log("User Type from sesion ->",userType)
  if(userType.toLowerCase().trim()!=="primary user"){
      isPrimary = false;
    }
  if(userType.toLowerCase().trim() === "primary user"){
    isPrimary = true;
    console.log("Updating primary user");
        // Update the user in the database
        const updatedUser = await primaryUsers.updateUser(
          user._id,
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
          password
        );
  
        console.log({"Updated User": updatedUser});
  
        // // Update the user information in the session
        // req.session.user = {
        //   ...req.session.user,
        //   firstName,
        //   middleName,
        //   lastName,
        //   emailAddress,
        //   countryCode,
        //   phoneNumber,
        //   city,
        //   state,
        //   country,
        //   dob,
        // };
        
  
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
            dob: xss(updatedUser.dob),
            listings: updatedUser.listings,
            wallet: xss(updatedUser.wallet),
            role: xss(updatedUser.role),
          };
  
  
          console.log("Updated Primary User in session is -> ", req.session.user);
          let successMsg = `<div id="successMsg" class="successMsg" > Your Profile Details have been Successfully Updated!</div>`
  
        // Redirect to the profile page with a success message
        // req.flash('success', 'Profile updated successfully.');
        // res.redirect('/profile');
        let countryList  = helpers.countryCalculator(helpers.countryCodes);
        res.status(200).render('profile',{title: 'profile',user:updatedUser, countryCodes: helpers.countryCodes, countryList: countryList, success: successMsg})
  }else{
    isPrimary=false;
    console.log("Update Scout User method");
        // Update the user in the database
        const updatedUser = await scoutUsers.updateUser(
          user._id,
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
          password
        );
  
        console.log({"Updated User": updatedUser});
  
        // // Update the user information in the session
        // req.session.user = {
        //   ...req.session.user,
        //   firstName,
        //   middleName,
        //   lastName,
        //   emailAddress,
        //   countryCode,
        //   phoneNumber,
        //   city,
        //   state,
        //   country,
        //   dob,
        // };
        
  
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
            dob: xss(updatedUser.dob),
            listings: updatedUser.listings,
            wallet: xss(updatedUser.wallet),
            role: xss(updatedUser.role),
          };
  
  
          console.log("Updated User in session is -> ", req.session.user);
          let successMsg = `<div id="successMsg" class="successMsg" > Your Profile Details have been Successfully Updated!</div>`
  
        // Redirect to the profile page with a success message
        // req.flash('success', 'Profile updated successfully.');
        // res.redirect('/profile');
        let countryList  = helpers.countryCalculator(helpers.countryCodes);
        res.status(200).render('profile',{title: 'profile',user:updatedUser, countryCodes: helpers.countryCodes, countryList: countryList, success: successMsg, isPrimary})
  }
  
    } catch (error) {
       console.log("Error caugth");
      console.log(error);
        let countryList = helpers.countryCalculator(helpers.countryCodes)
      // res.render('profile',{title: 'profile',user:user, countryCodes: helpers.countryCodes, countryList: countryList})
      res.status(400).render('profile',{title: 'profile',user:user, countryCodes: helpers.countryCodes, countryList: countryList, error: `<div id="error" class="error" > ${error}</div>`});
    }
  });

  
 //Route for scout user - only scout user have access to this rout - takes care of authentication
router.route('/scoutuser').get(middlewareMethods.scoutMiddleware, async (req, res) => {
  //code here for GET
  //console.log("Protected route is hit");
  let firstName = xss(req.session.user.firstName);
  let role = xss(req.session.user.role);

  let scoutID = xss(req.session.user._id);

  const allListings = await scoutUsers.getAllListings(scoutID);

  let isEmptyListings = false;
  if(allListings.length===0){
    isEmptyListings = true;
  }

  let reset = false
  
  if(role.toLowerCase().trim()==='primary user'){
    let htmlCode = `<p><a href="/primaryuser">Click here to Access primary user Route</a></p>`
    res.render('primaryuser', {title: 'scout user', firstName: firstName, currentTime: new Date().toUTCString(), role: role, primaryuser: htmlCode})
  }else{
    res.render('scoutuser', {title: 'scout user', reset: reset, isEmptyListings: isEmptyListings, listings: allListings, firstName: firstName, currentTime: new Date().toUTCString(), role: role})
  }
}).post( async (req,res)=>{
  let firstName = xss(req.session.user.firstName);
  let role = xss(req.session.user.role);
  console.log("Search Listing post route is triggered");
  let searchKey = xss(req.body.searchInput);
  console.log("Search Key -> ", searchKey);
  const searchedListings = await scoutUsers.searchListings(searchKey);

  


  let reset = false;
  let isEmptyListings = false;
  if(searchedListings.length===0){
    isEmptyListings = true;
    reset = true;
  }


  console.log("isEmpty -> ",isEmptyListings);
  console.log("Reset -> ", reset);

  res.render('scoutuser', {title: 'scout user', reset: reset, isEmptyListings: isEmptyListings, listings: searchedListings, firstName: firstName, currentTime: new Date().toUTCString(), role: role})
});

 //Route for primary user - only primary user have access to this rout - takes care of authentication
router.route('/primaryuser').get(middlewareMethods.primaryMiddleware, async (req, res) => {
  //code here for GET
  console.log("Primary user route is hit");
  let firstName = xss(req.session.user.firstName);
  
  res.render('primaryuser', {title: 'primary user', firstName: firstName, currentTime: new Date().toUTCString()})
});

//This is the route for displaying error
router.route('/error').get(async (req, res) => {
  //code here for GET
  res.render('error', {title: 'error'})
});

//This is the route for logout
router.route('/logout').get(middlewareMethods.logoutMiddleware, async (req, res) => {
  //code here for 
  let firstName = xss(req.session.user.firstName);
  req.session.destroy();
  res.render('logout', {title: 'logout', firstName: firstName});
});

//This route will only be accssed by primary user - takes care of authentication
router.route('/addlisting').get(middlewareMethods.primaryMiddleware, async(req, res)=>{
  console.log("Get Method of Add Listing route is triggered!");
  let countryList = helpers.countryCalculator(helpers.countryCodes)
  res.render('addListing', {title: 'Add Listings' ,countryCodes: helpers.countryCodes, countryList: countryList})
}).post( async(req,res)=>{
  console.log("Post Method of Add Listing route is triggered!!");
  
  let listingName = xss(req.body.listingNameInput);
  let listingLink = xss(req.body.listingLinkInput);
  let street = xss(req.body.streetInput);
  let city = xss(req.body.cityInput);
  let state = xss(req.body.stateInput);
  let country = xss(req.body.countryInput);
  let pincode = xss(req.body.pincodeInput);
  let rent = xss(req.body.rentInput);
  let additionalInfo = xss(req.body.additionalInfoInput);
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
    rent: rent,
    additionalInfo: additionalInfo,
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
  rent = helpers.checkEmptyInputString(rent, "Rent");
  additionalInfo = helpers.checkEmptyInputString(additionalInfo, "Additional Info");
  agentNumber = helpers.checkEmptyInputString(agentNumber, "Agent Number");
  ownerNumber = helpers.checkEmptyInputString(ownerNumber, "Owner Number");
  reward = helpers.checkEmptyInputString(reward, "Reward");

    helpers.checkPropertyNameInput(listingName, "Listing Name");
    helpers.isValidWebsiteLink(listingLink);
    helpers.checkStateNameInput(state, "State");
    helpers.checkStateNameInput(city, "City");
    helpers.isValidCountry(country);
    helpers.isValidPincode(pincode);
    helpers.isValidRent(rent);
    helpers.isValidAdditionalInfo(additionalInfo);
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



    const userListing = await primaryUsers.addListing(emailAddress, listingName, listingLink, street, city, state, country, pincode, rent, additionalInfo, agentNumber, ownerNumber, reward);

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
    dob: xss(updatedUser.dob),
    listings: updatedUser.listings,
    wallet: xss(updatedUser.wallet),
    role: xss(updatedUser.role),
  };
  

  console.log("Updated user session cookie : ", req.session.user);


  let countryList = helpers.countryCalculator(helpers.countryCodes)
  return res.render('addListing', {title: 'Add Listings' ,countryCodes: helpers.countryCodes, countryList: countryList, success: successMsg})
  


});

//This route will only be accssed by primary user - takes care of authentication
router.route('/viewprimarylistings').get(middlewareMethods.primaryMiddleware, async (req, res) => {
  //code here for GET


  let userID = req.session.user._id.toString()
  const listings = await primaryUsers.viewListings(userID);
  let isEmptyListings = false;
  if(listings.length===0){
    isEmptyListings = true;
  }

  res.render('viewListings', {title: 'View Listings', isEmptyListings: isEmptyListings, listings: listings})
  
});

//This route will only be accessed by scout user - takes care of authentication
//This route retrieves all the listings that is subscribed by the user that is in active state / active=true
router.route('/viewactivesubscribes').get(middlewareMethods.scoutMiddleware, async (req, res) => {
  //code here for GET


  let userID = xss(req.session.user._id.toString());
  const activeSubscribes = await scoutUsers.getScoutActiveSubscribedListings(userID)
  let isEmptySubscribes = false;
  if(activeSubscribes.length===0){
    isEmptySubscribes = true;
  }

  console.log("ActiveSubs -> from auth : ", activeSubscribes);
  console.log("is Empty ->", isEmptySubscribes);

  res.render('viewactivescoutsubscribes', {title: 'Active Subscribes ', activeSubscribes: activeSubscribes, isEmptySubscribes: isEmptySubscribes})
  
});

//This route will only be accessed by scout user - takes care of authentication
//This route retrieves all the listings that is subscribed by the user that is in inactive state / active = false
router.route('/viewScoutSubscribedListingHistory').get(middlewareMethods.scoutMiddleware, async (req, res) => {
  //code here for GET


  let userID = xss(req.session.user._id.toString());
  const subscribedHistory = await scoutUsers.getScoutSubscribedListingsHistory(userID)
  let isEmptyHistory = false;
  if(subscribedHistory.length===0){
    isEmptyHistory = true;
  }

  console.log("subHistory -> from auth : ", subscribedHistory);
  console.log("is Empty ->", isEmptyHistory);

  res.render('viewScoutSubscribedListingHistory', {title: 'Active Subscribes ', subscribedHistory: subscribedHistory, isEmptyHistory: isEmptyHistory})
  
});

//This route is only accessed when user is not authenticated
router.route('/homepage').get(middlewareMethods.homepageAuthentication, async (req, res) => {
  //code here for GET


  
  const allListings = await scoutUsers.getAllListings();

  let isEmptyListings = false;
  if(allListings.length===0){
    isEmptyListings = true;
  }

  let user = req.session.user
  if(!user){
    return res.render('homepage', {title: 'Homepage', isEmptyListings: isEmptyListings, listings: allListings})
  }
  
}).post( async (req,res)=>{
  console.log("Search Listing post route is triggered");
  let searchKey = xss(req.body.searchInput);
  console.log("Search Key -> ", searchKey);
  const searchedListings = await scoutUsers.searchListings(searchKey);

  let reset = false;
  let isEmptyListings = false;
  if(searchedListings.length===0){
    isEmptyListings = true;
    reset = true;
  }


  console.log("isEmpty -> ",isEmptyListings);
  console.log("Reset -> ", reset);

  let user = req.session.user
  if(!user){
    return res.render('homepage', {title: 'Homepage', reset: reset, isEmptyListings: isEmptyListings, listings: searchedListings})
  }
});

//This route will only be accessed by scout user - takes care of authentication
//route for scout user to subscribe to a listing
router.route('/subscribelisting/:listingID').post( async (req, res) => {
  console.log("Subscribe route event is triggered for scout user");
  let listingID = xss(req.params.listingID);
  console.log("Listing id -> ", listingID);
  let userID = xss(req.session.user._id);

  try {
    const subscribe = await scoutUsers.subscribe(listingID, userID)
    
    // Sending a success response if the subscription is successful
    if (subscribe) {
      res.status(200).json({ message: 'Subscription successful' });
    } else {
      // sending an error message if the subscription fails
      res.status(400).json({ message: 'Failed to subscribe' });
    }
  } catch (error) {
    console.error('Error subscribing to listing:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

//route for scout user to unsubscribe to a listing
router.route('/unsubscribelisting/:listingID').post(async (req, res) => {
  console.log("Unsubscribe route event is triggered for scout user");
  let listingID = xss(req.params.listingID);
  console.log("Listing id -> ", listingID);

  try {
    const unsubscribe = await users.unsubscribe(listingID);
    
    if (unsubscribe) {
      res.status(200).json({ message: 'Unsubscription successful' });
    } else {
      res.status(400).json({ message: 'Failed to unsubscribe' });
    }
  } catch (error) {
    console.error('Error unsubscribing from listing:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


//This route is to update listing posted by the primary user, only primary user is authorized to access this link
router.route('/updateListing/:listingID').post( async (req, res) => {
  //code here for POST
  console.log("Update Listing post route is triggered");

  // let listingID = xss(req.body.listingIDInput);
  try {
    
    let listingID = xss(req.params.listingID);
  let listingName = xss(req.body.listingName);
  let listingLink = xss(req.body.listingLink);
  let street = xss(req.body.street);
  let city = xss(req.body.city);
  let state = xss(req.body.state);
  let country = xss(req.body.country);
  let pincode = xss(req.body.pincode);
  let rent = xss(req.body.rent);
  let additionalInfo = xss(req.body.additionalInfo);
  let agentNumber = xss(req.body.agentNumber);
  let ownerNumber = xss(req.body.ownerNumber);
  let reward = xss(req.body.reward);

  const inputData = {
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
  };


  //validations
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

    helpers.checkStreetName(street);
    helpers.checkStateNameInput(state, "State");
    helpers.checkStateNameInput(city, "City");
    helpers.checkPropertyNameInput(listingName, "Listing Name");
    helpers.isValidWebsiteLink(listingLink);
    helpers.isValidCountry(country);
    helpers.isValidPincode(pincode);
    helpers.isValidRent(rent);
    helpers.isValidAdditionalInfo(additionalInfo);
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



    const userListing = await primaryUsers.updateListing(listingID, emailAddress, listingName, listingLink, street, city, state, country, pincode, rent, additionalInfo, agentNumber, ownerNumber, reward);

    console.log("Updated User -> ", userListing.updatedUser);
    console.log("listingID -> ", userListing.listingID);


    let updatedUser = userListing.updatedUser;


  let successMsg = `<div id="successMsg" class="successMsg" > Your Listing Details have been Successfully Updated! Your Listing Ref ID is : ${listingID}</div>`

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
    dob: xss(updatedUser.dob),
    listings: updatedUser.listings,
    wallet: xss(updatedUser.wallet),
    role: xss(updatedUser.role),
  };
  

  console.log("Updated user session cookie : ", req.session.user);


  let countryList = helpers.countryCalculator(helpers.countryCodes)
  return res.status(200).render('viewlistings', {title: 'Views Listings' ,countryCodes: helpers.countryCodes, countryList: countryList, successMsg: successMsg})

  } catch (error) {

    let countryList = helpers.countryCalculator(helpers.countryCodes)
    return res.status(404).render('viewlistings', {title: 'Views Listings' ,countryCodes: helpers.countryCodes, countryList: countryList, error: `<div id="error" class="error" > ${error}</div>`})
    
  }
  


});


//Only Primary users are authorized to see primary wallet route
router.route('/primaryWallet').get(middlewareMethods.primaryMiddleware, async (req, res) => {
  //code here for GET
  //Added wallet functionality. This functionality allows primary user to fetch his/her wallet balance


  try {
    let userID = req.session.user._id;

  const walletBalance = await primaryUsers.getWalletBalance(userID);

  console.log("Wallet Balance -> ", walletBalance);

  let isBalZero = false;
  if(walletBalance === 0){
    isBalZero = true;
  }

  if(req.session.user.role.toLowerCase() ==="primary user"){
    const navBar = `<nav class="navbar">
    <div class="navbar-logo">
      <a href="#">
        <img src="/public/image/unnamed.png" alt="Logo">
      </a>
    </div>
    <ul class="navbar-nav">
      <li class="nav-item">
        <a class="nav-link" href="#">Home</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="/addlisting">Add Listings</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="/viewprimarylistings">View Listings</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="/getWalletBallance">Wallet</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="#">Profile</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="/logout">Logout</a>
      </li>
    </ul>
  </nav>`;

  let name = ` ${req.session.user.firstName} ${req.session.user.middleName} ${req.session.user.lastName}`;

  return res.render('primarywallet', {title: 'Wallet Balance', name: name,  walletBalance: walletBalance, isBalZero:isBalZero})
  }
  } catch (error) {
    return res.status(404).render('error', {title: "Error!!", error: error})
  }


})

//This route is used to access scout user's wallet. Only authorized scout user's are allowed to view this
router.route('/scoutWallet').get(middlewareMethods.scoutMiddleware, async (req, res) => {
  //code here for GET
  //Added wallet functionality. This functionality allows primary user to fetch his/her wallet balance


  let userID = req.session.user._id;

  const walletBalance = await scoutUsers.getWalletBalance(userID);

  console.log("Wallet Balance -> ", walletBalance);

  let isBalZero = false;
  if(walletBalance === 0){
    isBalZero = true;
  }

  if(req.session.user.role.toLowerCase() ==="scout user"){

    let name = ` ${xss(req.session.user.firstName)} ${xss(req.session.user.middleName)} ${xss(req.session.user.lastName)}`

  return res.render('scoutwallet', {title: 'Wallet Balance', name: name,  walletBalance: walletBalance, isBalZero:isBalZero});
  }
});

//This route should only be accessed by primary user to add his money
router.route('/addmoney').get(middlewareMethods.primaryMiddleware, async (req, res) =>{
  //Adding Add money route functionality to add money to primary user waller

  console.log("add money route is hit!!");

  return res.status(200).render('payment', {title: 'Payments Page | Add MoneY', });

}).post( async (req, res) =>{
  //Payment route funtionality ot post changes
  console.log("Payment route post method is triggred!");
  console.log("Req Body ", req.body);

  let userID = xss(req.session.user._id);
  

  try {
    let cardNumber = helpers.checkEmptyInputString(xss(req.body.cardNumberInput), "Card Number");
  let cvv = helpers.checkEmptyInputString(xss(req.body.cvvInput), "CVV");
  let amount = helpers.checkEmptyInputString(xss(req.body.amountInput), "Amount");

  helpers.isValidCardNumber(cardNumber);
  helpers.isValidCVV(cvv);
  helpers.isValidAmount(amount);

  const updatedUser = await primaryUsers.addMoneyToWallet(userID, cardNumber, cvv, amount)
  const walletBalance = updatedUser.wallet;

  let isBalZero = false;
  if(walletBalance === 0){
    isBalZero = true;
  }

  console.log("Updated balance is -> ", updatedUser.wallet);
  let name = ` ${xss(req.session.user.firstName)} ${xss(req.session.user.middleName)} ${xss(req.session.user.lastName)}`

  let successMsg = `<div id="successMsg" class="successMsg" > Your Wallet have been Successfully Updated!</div>`

  return res.status(200).render('primarywallet', {title: 'Wallet Balance', name: name,  walletBalance: walletBalance, isBalZero:isBalZero, success: successMsg})

  } catch (error) {
    console.log("Error -->", error);

    return res.status(404).render('payment', {title: 'Payments Page | Add MoneY', error: `<div id="error" class="error" > ${error}</div>`});
  }



});

//Writing this route to view all the listings of primary subscribers that are subscribed by some scout!
//only primary users are allowed to access this route!
router.route('/viewScoutSubscribedlistings').get(middlewareMethods.primaryMiddleware, async (req, res) =>{

  console.log("viewScoutSubscribedlistings GET route is hit!!");

  try {
    
    let userID = xss(req.session.user._id.toString())
  const listings = await primaryUsers.viewScoutSubscribedlistings(userID);
  
  for(let i=0; i< listings.length; i++){
    let scoutID = listings[i].scoutID
    let scoutNameDetails = await scoutUsers.getScoutNameDetails(scoutID)
    let scoutName = scoutNameDetails.name;
    listings[i].scoutName = scoutName;

    console.log("Scout Name : ", scoutName);
  }

  let isEmptyListings = false;
  if(listings.length===0){
    isEmptyListings = true;
  }

  //converting my array object to json type so that it will be easier for me to pass it to my uri encoder later
  const jsonListings = JSON.stringify(listings)

  res.status(200).render('viewScoutSubscribedlistings', {title: 'View Scout Subbed Listings', isEmptyListings: isEmptyListings, listings: listings, jsonListings: jsonListings})

  } catch (error) {
    console.log(error);
  }

});

//This route is for primary users only! This function retrieves additional info of the listing and allows users to post comments and chat
router.route('/trackListing').get( async (req, res) => {
  console.log("Get Method of trackingListing route is triggered!!");

  try {
    // Get the _id from the query parameters
    const listingID = xss(req.query.id);
    console.log("Received Listing ID:", listingID);

    let listing = await listings.getListing(listingID);


    

    let scoutNameDetails = await scoutUsers.getScoutNameDetails(listing.scoutID)
    const scoutName = scoutNameDetails.name;
    listing.scoutName = scoutName; 

    console.log("Listing Data -> ", listing);

    if(!listing.messageID || listing.messageID === ""){
      return res.status(200).render('taskListing', {title: 'Task Listing', listing: listing})
    }

    console.log("Is my messageID -> ", listing.messageID);

    let message = await messages.getMessageById(listing.messageID.toString());

    console.log("HMM THIS SHOULD RENDER");
    let commentsList = message.comments;
    commentsList.forEach(comment => {
      comment.commenterId = comment.commenterId.toString();
      comment.userID = comment.userID.toString();
      comment.scoutID = comment.scoutID.toString();
      comment.isCurrentUser = comment.commenterId === comment.userID;
      comment.side = comment.isCurrentUser ? 'left' : 'right';
      comment.scoutName = scoutName

      comment.timestamp = helpers.formatDate(comment.timestamp);
});

  let progress = listing.progressbar;
  let twentyFive = false;
  let fifty = false;
  let seventy = false;
  let hundred = false
  if(!progress || progress === "" || progress === 0){
    twentyFive = false;
    fifty = false;
    seventy = false;
    hundred = false
  }else if(progress === 25){
    twentyFive = true;
    fifty = false;
    seventy = false;
    hundred = false

  }else if(progress === 50){
    twentyFive = false;
    fifty = true;
    seventy = false;
    hundred = false
  }else if(progress === 70){
    twentyFive = false;
    fifty = false;
    seventy = true;
    hundred = false
  } else if(progress === 100){
    twentyFive = false;
    fifty = false;
    seventy = false;
    hundred = true
}

let userID = xss(req.session.user._id);

  let balance = await primaryUsers.getWalletBalance(userID);
  let reward = parseInt(listing.reward, 10);

  let hasMoney = true;
  if(balance<reward){
    hasMoney = false;
  }


    console.log("wHAT IS MY COMMENT ARR -> ", commentsList);

    return res.status(200).render('taskListing', {title: 'Task Listing', listing: listing, commentsList: commentsList, twentyFive: twentyFive, fifty: fifty, seventy: seventy, hundred: hundred, hasMoney: hasMoney})

    

    // Do something with the listingId

  } catch (error) {
    console.log(error);
  }
});

//This route should only be accessed by scout to see their tasks
router.route('/viewTask').get( async (req, res) => {
  console.log("View Task of subscriber route is triggered!!");

  try {

    console.log("iS THIS FINE!");
    const listingID = xss(req.query.listingId);

    console.log("Listing ID recieved  -> ", listingID);

    let listing = await listings.getListing(listingID);


    console.log("Listing is retrieved");
    

    let primaryNameDetails = await primaryUsers.getPrimaryNameDetails(listing.userID)
    const primaryName = primaryNameDetails.name;
    listing.primaryName = primaryName; 

    console.log("Listing Data -> ", listing);

    if(!listing.messageID || listing.messageID === ""){
      return res.status(200).render('viewtask', {title: 'Task Listing', listing: listing})
    }

    console.log("Is my messageID -> ", listing.messageID);

    let message = await messages.getMessageById(listing.messageID.toString());

    let commentsList = message.comments;
    commentsList.forEach(comment => {
      comment.commenterId = comment.commenterId.toString();
      comment.userID = comment.userID.toString();
      comment.scoutID = comment.scoutID.toString();
      comment.isCurrentUser = comment.commenterId === comment.scoutID;
      comment.side = comment.isCurrentUser ? 'left' : 'right';
      comment.primaryName = primaryName

      comment.timestamp = helpers.formatDate(comment.timestamp);
});


    let progress = listing.progressbar;
    let twentyFive = false;
    let fifty = false;
    let seventy = false;
    let hundred = false
    if(!progress || progress === "" || progress === 0){
      twentyFive = false;
      fifty = false;
      seventy = false;
      hundred = false
    }else if(progress === 25){
      twentyFive = true;
      fifty = false;
      seventy = false;
      hundred = false

    }else if(progress === 50){
      twentyFive = false;
      fifty = true;
      seventy = false;
      hundred = false
    }else if(progress === 70){
      twentyFive = false;
      fifty = false;
      seventy = true;
      hundred = false
    } else if(progress === 100){
      twentyFive = false;
      fifty = false;
      seventy = false;
      hundred = true
    }
    

    console.log("wHAT IS MY COMMENT ARR -> ", commentsList);

    console.log(progress);

    return res.status(200).render('viewtask', {title: 'View Task', progress: listing.progressbar, listing: listing, commentsList: commentsList, twentyFive: twentyFive, fifty: fifty, seventy: seventy, hundred: hundred})

    
  } catch (error) {
    
  }

});


//primaryComment route is used to post comments by primary user on a perticular listing
//This route will only be accessible to primary user
router.route('/primaryComment').post( async (req, res) => {
  //code here for POST

  try {

    console.log("Post route of primary comment is called!!");

    let comment = helpers.checkEmptyInputString(xss(req.body.comment));
    let listingID = helpers.checkEmptyInputString(xss(req.body.listingId));
    let userID = helpers.checkEmptyInputString(xss(req.body.userId));
    let scoutID = helpers.checkEmptyInputString(xss(req.body.scoutId));
    let messengerType = xss(req.body.messengerType);

    console.log("comment:", comment);
    console.log("listingId:", listingID);
    console.log("userId:", userID);
    console.log("scoutId:", scoutID);
    console.log("messageType", messengerType);

  

    

    if(!messengerType){
      throw `Error! Your user Session has expired, please try logging!`;
    }else if(!messengerType.trim()){
      throw `Error! Your user Session has expired, please try logging!`;
    }

     helpers.isValidComment(comment)

     console.log("It is a primary user comment");
     let messageData = await primaryUsers.postComment(listingID, userID, scoutID, comment);
     console.log("The comment messages are : ", messageData);

     let commentsList = messageData.comments;
     
    

     let listing = await listings.getListing(listingID);

   

   let scoutNameDetails = await scoutUsers.getScoutNameDetails(listing.scoutID)
   const scoutName = scoutNameDetails.name;
   listing.scoutName = scoutName; 

   commentsList.forEach(comment => {
    comment.commenterId = comment.commenterId.toString();
    comment.userID = comment.userID.toString();
    comment.scoutID = comment.scoutID.toString();
    comment.isCurrentUser = comment.commenterId === comment.userID;
    comment.side = comment.isCurrentUser ? 'left' : 'right';
    comment.scoutName = scoutName

    comment.timestamp = helpers.formatDate(comment.timestamp);
});

   console.log("Is all ok");
   console.log(commentsList);

     return res.status(200).render('taskListing', {title: 'Task Listing', listing: listing, commentsList: commentsList})


    
    







  } catch (error) {
    return res.status(404).json(error)
  }

  


});

//scoutComment route is used to post comments by scout user on a perticular listing that they have subscribed to
//This route will only be accessible to scout users
router.route('/scoutComment').post( async (req, res) => {
  //code here for POST

  try {


    let comment = helpers.checkEmptyInputString(xss(req.body.comment));
    let listingID = helpers.checkEmptyInputString(xss(req.body.listingId));
    let userID = helpers.checkEmptyInputString(xss(req.body.userId));
    let scoutID = helpers.checkEmptyInputString(xss(req.body.scoutId));
    let messengerType = xss(req.body.messengerType);

    console.log("comment:", comment);
    console.log("listingId:", listingID);
    console.log("userId:", userID);
    console.log("scoutId:", scoutID);
    console.log("messageType", messengerType);

  

    

    if(!messengerType){
      throw `Error! Your user Session has expired, please try logging!`;
    }else if(!messengerType.trim()){
      throw `Error! Your user Session has expired, please try logging!`;
    }

     helpers.isValidComment(comment)

     console.log("It is a Scout user comment");
     let messageData = await scoutUsers.postComment(listingID, userID, scoutID, comment);
     console.log("The comment messages are : ", messageData);

     let commentsList = messageData.comments;

     

     let listing = await listings.getListing(listingID);

   

   let primaryNameDetails = await primaryUsers.getPrimaryNameDetails(listing.userID)
   const primaryName = primaryNameDetails.name;
    listing.primaryName = primaryName; 

    commentsList.forEach(comment => {
      comment.commenterId = comment.commenterId.toString();
      comment.userID = comment.userID.toString();
      comment.scoutID = comment.scoutID.toString();
      comment.isCurrentUser = comment.commenterId === comment.scoutID;
      comment.side = comment.isCurrentUser ? 'left' : 'right';
      comment.scoutName = primaryName

      comment.timestamp = helpers.formatDate(comment.timestamp);
});

   console.log("Is all ok");
   console.log(commentsList);

     return res.status(200).render('viewtask', {title: 'Task Listing', listing: listing, commentsList: commentsList})


    
    







  } catch (error) {
    return res.status(404).json(error)
  }

  


});

//both scout and primary user have access to this route
router.route('/updateprogressbar').post( async (req, res)=>{
  console.log("update progresbar method is hit");

  try {
    const progressValue = xss(req.body.value);
  const listingID = xss(req.body.listingID);
  const userID =xss(req.session.user._id)


  console.log("Recieved progress value is : ", progressValue);
  console.log("Recieved listingID is : ", listingID);

  let listing = await listings.getListing(listingID);
  const scoutID = listing.scoutID;
  const reward = parseInt(listing.reward,10);

  //const userBalance = await primaryUsers.getWalletBalance(userID);

  

  
    console.log("Primary User has closed the listing");
    let updatedScout = await scoutUsers.listingFinished(listingID, scoutID)
    let scoutWalletUpdate = await scoutUsers.addReward(scoutID, reward)
    let primaryWalletUpdate = await primaryUsers.subtractRewardMoney(userID, reward)
  

  console.log("Is this called");
  let newListing = await listings.updateProgress(listingID, progressValue)

  
  return res.status(200).json({message: 'successful'})
  } catch (error) {
    return res.status(200).render('error', {title: "Unable to update Porgressbar", error: `<div id="error" class="error" > ${error}</div>`})
  }

})








export default router;
